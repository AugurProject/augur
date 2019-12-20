# Flash Scripts

## Running a local node with canned markets

First, enter interactive mode: `yarn flash interactive`
In interactive mode (It will show `augur$` in the terminl):

    ganache
    deploy
    create-canned-markets-and-orders

The local ganache node is now running in your terminal. You can interact with it using flash commands.
Type `help` for a list.

## FAQ

Pro Tip: Interactive mode has tab-completion so instead of

    create-canned-markets-and-orders

you can type

    cr <TAB> c

# Flash Session on local node

 * yarn docker:geth:pop

To use flash for a session to push time report or dispute. use interactive mode

## Connect
This connects the session to ethereum node, connect as a specific user and/or start SDK in order to use getters

for options `connect --help`
`-u` to connect the SDK
`-a` to specify an account address to use, if not contract owner account is used.
`-n` for network, don't specify this for local node on port 8545

Some scripts need SDK getters to get MarketInfo for example. The script that need SDK will print a message if the SDK isn't wired up.


## push-timestamp

for options `push-timestamp --help`

## initial-report

Will initial report for a market, it's possible to add pre-emptive stake, check `--help` for details.

## dispute

Will dispute a market that has a tentive winning outcome


# Templates

## generate templates

If templates or picklists need to change, update `templates-template.ts` in augur-tools then run
`yarn flash-util generate-templates`. The templates.ts file will get updated in augur-artifacts.

## show-template

Given a template hash this script will display the template. hash values are found in `templates.ts` file in augur-artifacts. Note that this is a generated file using the flash command `generate-templates`

ie `yarn flash-util show-template --hash 0xb1e8150accfc1fb7e312342f9a45f333e7468dbdb39ca696501d221fc72a1675`

Displays the following. Notice picklist values are included:
```json
{
 "marketType": "YesNo",
 "question": "Will [0] win the [1] [2]?",
 "example": "Will American Pharoah win the 2020 Triple Crown?",
 "inputs": [
  {
   "id": 0,
   "type": "TEXT",
   "placeholder": "Horse"
  },
  {
   "id": 1,
   "type": "DROPDOWN",
   "placeholder": "Year",
   "values": [
    {
     "value": "2019",
     "label": "2019"
    },
    {
     "value": "2020",
     "label": "2020"
    },
    {
     "value": "2021",
     "label": "2021"
    },
    {
     "value": "2022",
     "label": "2022"
    },
    {
     "value": "2023",
     "label": "2023"
    },
    {
     "value": "2024",
     "label": "2024"
    },
    {
     "value": "2025",
     "label": "2025"
    }
   ]
  },
  {
   "id": 2,
   "type": "DROPDOWN",
   "placeholder": "Event",
   "values": [
    {
     "value": "Kentucky Derby",
     "label": "Kentucky Derby"
    },
    {
     "value": "Preakness",
     "label": "Preakness"
    },
    {
     "value": "Belmont",
     "label": "Belmont"
    },
    {
     "value": "Triple Crown",
     "label": "Triple Crown"
    },
    {
     "value": "Breeder's cup",
     "label": "Breeder's cup"
    },
    {
     "value": "Travers Stakes",
     "label": "Travers Stakes"
    },
    {
     "value": "Arlington Million",
     "label": "Arlington Million"
    },
    {
     "value": "Santa Anita Handicap",
     "label": "Santa Anita Handicap"
    },
    {
     "value": "Arkansas Derby",
     "label": "Arkansas Derby"
    },
    {
     "value": "Pacific Classic Stakes",
     "label": "Pacific Classic Stakes"
    },
    {
     "value": "Haskell Invitational Stakes",
     "label": "Haskell Invitational Stakes"
    },
    {
     "value": "Pegasus World Cup",
     "label": "Pegasus World Cup"
    },
    {
     "value": "Dubai World Cup",
     "label": "Dubai World Cup"
    }
   ]
  }
 ],
 "resolutionRules": {
  "REQUIRED": [
   {
    "text": "If the horse named in the market is scratched and does NOT run, including the cancellation of the race, or is disqualified for any reason, the market should resolve as 'No'."
   }
  ]
 },
 "hash": "0xb1e8150accfc1fb7e312342f9a45f333e7468dbdb39ca696501d221fc72a1675"
}
```

## validate-template

Script to help market creators to verify their market will be validated as a templated market. This can be very helpful when creating markets through APIs or directly on contract. Template structure will be described in v2 docs.

`yarn flash-util validate-template --title 'Will the CAC 40 close on or above 5200 on December 6, 2019?' --templateInfo '{"hash":"0x7c631efb5047c650e6afab2b7793caef8d28c6eb0adcf2710497a05f4acbad8d","question":"Will the [0] close on or above [1] on [2]?","inputs":[{"id":0,"value":"CAC 40","type":"DROPDOWN","timestamp":"CAC 40"},{"id":1,"value":"5200","type":"TEXT","timestamp":"5200"},{"id":2,"value":"December 6, 2019","type":"DATEYEAR","timestamp":"December 6, 2019"}]}' --endTime 1575763200 --resolutionRules 'Closing date is determine by the location of the exchange, where the underlying stocks for the index are traded'`


--title: is the title of the market that will populate description in market creation transaction.
--templateInfo: is the JSON.stringify version of template object in extraInfo in market creation transaction.
--endTime: is the timestamp for event expiration of the market, endTime in market creation transaction.
--resolutionRules: resolution rules separated by '\n' that would be included in extraInfo in market creation transaction.

The script will return 'success' for successful, meaning validation verified the market would be considered a templated market

If there is a failed validation step, `error: ...` and give an error of why.
Errors:

1. Required parameter missing:
error: `value missing template | hash | question | inputs | endTime`

2. Template has been retired and auto-failed, values in `packages/augur-tools/src/templates-retired.ts` and put in `templates.ts` in augur-artifacts:
error: `template hash has been retired and set to auto-fail`

3. If hash given doesn't have a validation structure in templates.ts
error: `no validation found for hash`

4. If the given market title doesn't match the constructed market title based on template inputs, example.
"Will the [0] close on or above [1] on [2]?" template string has input indexes the template.inputs fill in the indexes to produce a calculated market title "Will the CAC 40 close on or above 5200 on December 6, 2019?" given that the values are 0: 'CAC 40' 1: '5200' 2: 'December 6, 2019'
error: `populated title does not match title given`

5. For some templates they use ESTDATETIME input type, which is a timestamp for the estimated time the event is scheduled to start. that timestamp can not be before the market's expiration time (endTime)
error: `estimated schedule date time is after market event expiration endTime`

6. For some templates they use DATESTART input type, which is a timestamp for the day the event is scheduled to start. that timestamp can not be before the market's expiration time (endTime)
error: `start date is after market event expiration endTime`


7. Template inputs can not have duplicate values
error: `template input values have duplicates`

8. Outcome values can not have duplicate values
error: `outcome array has duplicates`

9. Validations have a regex for Market questions (title) based on input values needed to populated the market question template. Example, `Will the CAC 40 close on or above 5200 on December 6, 2019?` has to meet the following regex.

```
^Will the (S&P 500 Index|Dow Jones Industrial Average|Nasdaq Composite|Wilshire 5000|Russell 1000|NYSE Composite|MSCI World Index|FTSE All-World Index|Dow Jones Global Titans 50|S&P Global 100 Index|FTSE 100|DAX|Shanghai SE Composite|Hang Seng|Nikkei 225|S&P/TSX Composite|CAC 40|All Ordinaries|BSE Sensex 30|KOSPI Index|VIX) close on or above [0-9]+.*[0-9]* on (January|February|March|April|May|June|July|August|September|October|November|December) ([0-9]){2}, 20|([0-9]{2})\\?$
```
Notice that dropdown values are included and specific date format has to be met.
error: `populated market question does not match regex`

10. Most categorical templates have required outcomes, for example, "Other (Field)" is required so that a market can resolve with a valid outcome of the winning outcome isn't listed explicitly.
error: `required outcomes are missing`

11. Special data dropdown dependencies have to be met, for example, a crypto BTC/USD market can not use BTC/EUR source for market resolution.
error: `market question dropdown dependencies values are incorrect`

12. There is also possible Special data dropdown dependencies for outcomes, if an American Football market is for AFC football championship. NFC teams can not be used as outcomes.
error: `outcome dependencies are incorrect`

13. There are categorical markets that use market question inputs in outcomes. These values need to match, example Point Spread markets have the team name and points in the outcome. `[Team A] -[Whole #].5` gets updated with the team choice and points from market question to produce the outcome. example `Arizona Cardinals -4.5`
error: `outcomes values from substituted market question inputs are incorrect`

14. The resolution rules hash of passed in resolution rules needs to match the hash of the resolution rules in the validation structure.
error: `hash of resolution details is different than validation resolution rules hash`

15. For unexpected result like a crash error will be formated like `unknown, ...` with catch exception.
