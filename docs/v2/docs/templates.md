# Templates

Templates are meant to assist market creators in creating markets that will resolve correctly and avoid confusion with traders and reporters.


## Market Creation
There is a json stringified template object in `string _extraInfo` property in market creation transaction.

In the below example, `inputs` describe values that populate the template market question. Template market question of `NFL: Will the [0] win vs. the [1]?` will produce the following based on inputs.

This template provides a market question (title) of;
`NFL: Will the Arizona Cardinals win vs. the Atlanta Falcons?`
`Estimated sheduled start time: Dec 31 1969 6:00 PM (CST)`

In regards to the market creation template structure, it doesn't vary based on market type. Here are two market creation template objects, one YesNo and the other Categorical, they behave the same.

### Examples:
YesNo market:
```json
{
  "hash": "0xa5807ee39ca0820d64cfea3370d04ae94118dcfd902f6fe7bfa3234fc27f573c",
  "question": "NFL: Will the [0] win vs. the [1]?",
  "inputs": [
    {
      "id": 0,
      "value": "Arizona Cardinals",
      "type": "DROPDOWN",
      "timestamp": null
    },
    {
      "id": 1,
      "value": "Atlanta Falcons",
      "type": "DROPDOWN",
      "timestamp": null
    },
    {
      "id": 2,
      "value": "1575936000",
      "type": "ESTDATETIME",
      "timestamp": null
    }
  ]
}
```

Categorical market:
```json
{
  "hash": "0x652b787a2eed4ef1dc54739bdbcea162dfdd941e4b5dcaeaf7089dbddae37c78",
  "question": "NHL (O/U): [0] vs. [1]: Total goals scored; Over/Under [2].5?",
  "inputs": [
    {
      "id": 0,
      "value": "Anaheim Ducks",
      "type": "DROPDOWN",
      "timestamp": "Anaheim Ducks"
    },
    {
      "id": 1,
      "value": "Arizona Coyotes",
      "type": "DROPDOWN",
      "timestamp": "Arizona Coyotes"
    },
    {
      "id": 2,
      "value": "4",
      "type": "TEXT",
      "timestamp": "4"
    },
    {
      "id": 3,
      "value": "1575439200",
      "type": "ESTDATETIME",
      "timestamp": "1575439200"
    }
  ]
}
```
### Input types
Source documentation can be found in augur-artifacts `templates.ts` as `TemplateInputType`
Mainly used input types are

  TEXT, simple text input in market question
  DATEYEAR, date picker in market question for a day of the year
  DATETIME, date time with timezone value results in timestamp and full date time string
  ESTDATETIME, estimated scheduled start time date time picker with timezone, results in timestamp
  DROPDOWN, value from dropdown list


## Template Structure
The source template, unlike market creation template, varias based on input types and market type.

### YesNo template
```json
{
  "marketType": "YesNo",
  "question": "NHL: Will the [0] & [1] score [2] or more combined goals?",
  "example": "NHL: Will the NY Rangers & Dallas Stars score 5 or more combined goals?\nEstimated schedule start time: Sept 19, 2019 8:20 pm EST",
  "inputs": [
    {
      "id": 0,
      "type": "DROPDOWN",
      "placeholder": "Team A",
      "values": [
        {
          "label": "Anaheim Ducks",
          "value": "Anaheim Ducks"
        },
        {
          "label": "Arizona Coyotes",
          "value": "Arizona Coyotes"
        },

      ]
    },
    {
      "id": 1,
      "type": "DROPDOWN",
      "placeholder": "Team B",
      "values": [
        {
          "label": "Anaheim Ducks",
          "value": "Anaheim Ducks"
        },
        {
          "label": "Arizona Coyotes",
          "value": "Arizona Coyotes"
        },

      ]
    },
    {
      "id": 2,
      "type": "TEXT",
      "validationType": "WHOLE_NUMBER",
      "placeholder": "Whole #"
    },
    {
      "id": 3,
      "type": "ESTDATETIME",
      "placeholder": "Date time"
    }
  ],
  "resolutionRules": {
    "REQUIRED": [
      {
        "text": "Includes any Regulation, overtime and any shoot-outs."
      },
      {
        "text": "The game must go 55 minutes or more to be considered official. If it does not, the game will be considered unofficial and 'No' should be deemed the winning outcome."
      },
      {
        "text": "If game is not played market should resolve as 'No'"
      }
    ]
  },
  "hash": "0x89c212c6b66b13298c0cdbb93da729b79d86f3a11cf16f4617545221550f0e8a"
}
```
Elements of source templates:
`marketType`: type of market "YesNo", "CATEGORICAL", "SCALAR"
`question`: template market question
`example`: example of valid filled in market question
`inputs`: gives index as `id`, type of input and placeholder used for UI.
`resolutionRules`: resolution rules to assist traders and reports understand the market

### Template Input Type
  * ADDED_OUTCOME, Required outcome added to categorical market outcomes. Example input adds `Other (Field)` to categorical market's outcomes
  ```json
  {
    "id": 2,
    "type": "ADDED_OUTCOME",
    "placeholder": "Other (Field)"
  }
```
  * USER_DESCRIPTION_OUTCOME, Simple text input in market question that is added categorical market outcomes, Example input adds user input for market question, id 4 as categorical market outcome
  ```json
  {
    "id": 4,
    "type": "USER_DESCRIPTION_OUTCOME",
    "placeholder": "Player B"
  }
```
  * SUBSTITUTE_USER_OUTCOME, Subsitites market question values in outcome for categorical market template, Examples, market question input 0 is used to fill substitute input `[0]` in first input below. Second input 2 is used to populate `[2]` value. Both use market question value for input 1 to substitute `[1]`.
  ```json
  {
    "id": 4,
    "type": "SUBSTITUTE_USER_OUTCOME",
    "placeholder": "[0] -[1].5"
  },
  {
    "id": 5,
    "type": "SUBSTITUTE_USER_OUTCOME",
    "placeholder": "[2] +[1].5"
  }
```
result might look like `Arizona Cardinals -4.5` and `Atlanta Falcons +4.5`, where input 0 is "Arizona Cardinals" and input 2 is "Atlanta Falcons". Input 1 would be "4".

  * USER_DESCRIPTION_DROPDOWN_OUTCOME, Dropdown in market question that is added as categorical market outcome, Example; values can be a very long list.
  ```json
  {
    "id": 0,
    "type": "USER_DESCRIPTION_DROPDOWN_OUTCOME",
    "placeholder": "Team A",
    "values": [
      {
        "value": "Atlanta Hawks",
        "label": "Atlanta Hawks"
      },
      {
        "value": "Boston Celtics",
        "label": "Boston Celtics"
      },
    ]
  }
````

  * USER_DROPDOWN_OUTCOME, Dropdown for categorical market outcome, doesn't interact with market question. Example; values can be a very long list.
  ```json
  {
    "id": 2,
    "type": "USER_DROPDOWN_OUTCOME",
    "placeholder": "Select Team",
    "values": [
      {
        "value": "Atlanta Dream",
        "label": "Atlanta Dream"
      },
      {
        "value": "Chicago Sky",
        "label": "Chicago Sky"
      }
    ]
  }
  ```
  * USER_DESCRIPTION_DROPDOWN_OUTCOME_DEP, Dropdown for categorical market outcome, the list of values is determined by dropdown in market question. Example; the values [...] is short for array of values. Important property is `inputSourceId`, this is a dropdown of key values in market question. In this example they are "Eastern Conference Finals", "Western Conference Finals" and "NBA Championship". Based on value selected it will determine the values in a dropdown available to be added to categorical market outcomes.
  ```json
  {
    "id": 4,
    "type": "USER_DESCRIPTION_DROPDOWN_OUTCOME_DEP",
    "inputSourceId": 2,
    "placeholder": "Select Team",
    "values": {
      "Eastern Conference Finals": [...],
      "Western Conference Finals": [...],
      "NBA Championship": [...]
    }
  }
```
  * DROPDOWN_QUESTION_DEP, Market question dropdown determines other market question dropdown values. Example; the values [...] is short for array of values. This input values are "National League Championship Series", "American League Championship Series" and "World Series", based on the selection `inputDestId` dropdown values will get set.
  ```json
  {
    "id": 2,
    "type": "DROPDOWN_QUESTION_DEP",
    "placeholder": "Event",
    "inputDestId": 0,
    "values": {
      "National League Championship Series": [...],
      "American League Championship Series": [...],
      "World Series": [...],
    }
  }
  ```

## Retiring Templates
There is possibilities that market templates need to get retired. In this case their hash value will be added to a list. This will hide them in the UI market creation process. Existing markets using these templates will validate and be considered templated created markets.  There is a `autoFail` property that will cause template validation to fail. Example
```json
  {
    "hash": "0x........",
    "autoFail": true,
  }
  ```

## Template Validation
There are many validation steps to validate a market is derived from a template. See `isTemplateMarket` method in templates.ts in augur-artifacts for specific details on each validation step. Also see flash scripts `validate-template` method to get test validating a market creation template object and get error messages if doesn't pass.


## Adding New Templates
It is possible to add more templates to existing templates. The existing templates need to be preserved.  Example, more TEMPLATE(...) objects can be added to generate-templates.ts. The new templates will be folded into existing if they have a unique hash which gets generated during template generation process to create templates.ts in augur-artifacts.

```typescript
export const TEMPLATES2 = {
  ....
};
```
add new templates in new template object. This new object needs to be added to generate-templates.ts file in `generateTemplateValidations` method:

```typescript
export const generateTemplateValidations = async () => {
  const templateItems = [TEMPLATES, TEMPLATES2];
  ...
}
```
