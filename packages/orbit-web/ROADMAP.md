# Orbit Web

The current implementation status, immediate-term plans, and future goals of this repository.

We welcome feature requests as edits to the "[Backlog](#backlog)" section below. Suggest something by opening a pull request editing this file.

## Timeline

TBA

## Roadmap

Our short-to-medium-term roadmap items, in order of descending priority.

### Backlog

| Status  | Feature               | Owner                                    | Details                                                                                                                       |
| :------ | :-------------------- | :--------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------- |
| &#9745; | simplify startup      | [@latenssi](https://github.com/latenssi) | start the network automatically                                                                                               |
| &#9745; | fix build             | [@latenssi](https://github.com/latenssi) | currently build is not outputting a _standalone_ working web app, some paths are incorrect etc.                               |
| &#9745; | add alpha disclaimer  | [@latenssi](https://github.com/latenssi) | add a disclaimer that this is alpha version, things will break and chats will disappear etc.                                  |
| &#9745; | check documentation   | [@latenssi](https://github.com/latenssi) | make sure documentation is up to date before merging the new [version](https://github.com/orbitdb/orbit-chat) in to orbit-web |
| &#9745; | merge                 | [@latenssi](https://github.com/latenssi) | merge the new [version](https://github.com/orbitdb/orbit-chat) in to orbit-web as master branch                               |
| &#9745; | high memory usage     | [@latenssi](https://github.com/latenssi) | currently the memory usage of the app is very high, check what is causing it                                                  |
| &#9745; | high cpu usage        | [@latenssi](https://github.com/latenssi) | currently the cpu usage of the app is very high, check what is causing it                                                     |
| &#9745; | performance profiling | [@latenssi](https://github.com/latenssi) | check if something can be optimized                                                                                           |
| &#9745; | 60 fps level          | [@latenssi](https://github.com/latenssi) | check if we are meeting a "60 fps level" of smoothnes                                                                         |
| &#9744; | file streaming        | [@latenssi](https://github.com/latenssi) | allow streaming of files (videos) from web worker                                                                             |
| &#9744; | deploying             | [@latenssi](https://github.com/latenssi) | figure out an automated deployment strategy (deploying to IPFS is preferred)                                                  |
| &#9745; | domain                | [@latenssi](https://github.com/latenssi) | point orbit.chat domain to this repos deployment (wherever it is)                                                             |
| &#9745; | basic automated tests | [@latenssi](https://github.com/latenssi) | start implementing automated tests, keep it simple and lean                                                                   |
| &#9745; | load more messages    | [@latenssi](https://github.com/latenssi) | automatically load more messages as user scrolls up in the channels history                                                   |
| &#9745; | notifications         | [@latenssi](https://github.com/latenssi) | send notification to a user when somebody mentions her in the chat (e.g. "&commat;somebody hi!")                              |
| &#9745; | drag and drop files   | [@latenssi](https://github.com/latenssi) | support drag and drop of files                                                                                                |
| &#9745; | render spaces         | [@latenssi](https://github.com/latenssi) | currently "test&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;test" renders as "test test" in chat               |
| &#9745; | /me missing space     | [@latenssi](https://github.com/latenssi) | currently "/me doing something" renders as "mynicknamedoing something" in chat                                                |
| &#9745; | browser compatibility | [@latenssi](https://github.com/latenssi) | some users have reported that the app is not wokring on Firefox on linux                                                      |
| &#9745; | ProfilePanel position | [@latenssi](https://github.com/latenssi) | fix MessageUserProfilePanel vertical positioning, currently it can overflow from the top of the view                          |
| &#9745; | mobile version        | [@latenssi](https://github.com/latenssi) | make the app more progressive (PWA)                                                                                           |
| &#9745; | run ipfs in a worker  | [@latenssi](https://github.com/latenssi) | run ipfs in a service worker to mitigate the slowdowns caused by signature checks etc.                                        |
| &#9744; | private channels      | [@latenssi](https://github.com/latenssi) | write only for selected people, everyone can read (read can not be limited because of current techical limitations)           |
| &#9744; | chat pinner           | [@latenssi](https://github.com/latenssi) | a node which pins a chat so even if everybody leaves, it will keep the chat history in case somebody joins (e.g. IRC bot)     |
