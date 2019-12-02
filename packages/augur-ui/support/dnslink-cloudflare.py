#!/usr/bin/env python3

import argparse
import json
import os
import requests
import sys

try:
    os.environ['CF_API_KEY']
except KeyError:
    print('CF_API_KEY not set')
    sys.exit(1)

try:
    os.environ['CF_API_EMAIL']
except KeyError:
    print('CF_API_EMAIL is not set')
    sys.exit(1)

parser = argparse.ArgumentParser()
parser.add_argument('-d', '--domain', help="sets domain")
parser.add_argument('-l', '--link', help="ipfs sha")
parser.add_argument('-r', '--record', help="Domain record name")

args = parser.parse_args()

cf_api_key = os.environ['CF_API_KEY']
cf_api_email = os.environ['CF_API_EMAIL']
domain = args.domain
ipfs_path = 'dnslink=/ipfs/{}'.format(args.link)

headers = {
        'X-Auth-Email': '{}'.format(cf_api_email),
        'X-Auth-Key': '{}'.format(cf_api_key),
        'Content-Type': 'application/json'
        }


# gets account id
def query_account_id():
    url = 'https://api.cloudflare.com/client/v4/user'
    r = requests.get(url, headers=headers)
    userdata = r.json()
    # account_id = userdata['result']['id']
    return userdata['result']['id']


# gets zone id
def query_zone_id(domain):
    url = 'https://api.cloudflare.com/client/v4/zones?match=all'
    zone_request = requests.get(url, headers=headers)
    for zone in zone_request.json()['result']:
        if zone['name'] == domain:
            return zone['id']


def query_dns_records(zone_id):
    url = 'https://api.cloudflare.com/client/v4/zones/{}/dns_records?type=TXT'.format(zone_id)
    dns_records = requests.get(url, headers=headers)
    return dns_records.json()['result']


def dns_record_update(domain_zone_id, record_id, record_name):
    print('updating record')
    url = 'https://api.cloudflare.com/client/v4/zones/{}/dns_records/{}'.format(domain_zone_id,record_id)
    data = {
         'type': 'TXT',
         'name': record_name,
         'content': ipfs_path,
         'ttl': 120
     }
    record_update = requests.put(url,
                                 headers=headers,
                                 data=json.dumps(data)
                                 )
    print(record_update.content)
    if not record_update.status_code == requests.codes.ok:
        print(record_update.content)
    record_update.raise_for_status()


def dns_record_create(domain_zone_id, record_name, content):
    print('creating record')
    url = 'https://api.cloudflare.com/client/v4/zones/{}/dns_records'.format(domain_zone_id)
    data = {
        'type': 'TXT',
        'name': '{}'.format(record_name),
        'content': '{}'.format(content),
         'ttl': 120
        }
    record_create = requests.post(url,
                                  headers=headers,
                                  data=json.dumps(data)
                                  )
    if not record_create.status_code == requests.codes.ok:
        print(record_create.content)
    record_create.raise_for_status()


domain_zone_id = query_zone_id(args.domain)
dns_records = query_dns_records(domain_zone_id)

record_exists = False
for record in dns_records:
    record_id = record['id']
    record_name = record['name']
    if record['name'].startswith(args.record):
        dns_record_update(domain_zone_id, record_id, record_name)
        record_exists = True

if record_exists is False:
    record_name = args.record + '.' + args.domain
    content = ipfs_path
    print('creating record: {} with {}'.format(record_name,content))
    dns_record_create(domain_zone_id, record_name, content)

