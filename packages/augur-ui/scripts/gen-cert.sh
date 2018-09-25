openssl req -nodes -newkey rsa:4096 -sha256 -keyout augur-local.key -out augur-local.csr -subj "/C=US/ST=California/L=San Francisco/O=localhost/OU=local/CN=localhost"

openssl x509 -req -days 365 -in augur-local.csr -signkey augur-local.key -out augur-local.crt
