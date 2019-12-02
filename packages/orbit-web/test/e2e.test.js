/* eslint-env jest */
/* globals page jestPuppeteer */

require('@babel/polyfill')
const path = require('path')

// URL of the http-server running the production build
const baseUrl = 'http://localhost:8088'

// Fixtures
const testChannel1 = 'testchannel1'
const testChannel2 = 'testchannel2'
const username = 'testuser'
const testMessage = 'testing testing'
let timedMessage, timedMessage2, timedMessage3

jest.setTimeout(10 * 1000)

/*
 * A test scenario of a user logging in,
 * and sending messages to different channels
 */
describe('User scenario', () => {
  beforeAll(async () => {
    await jestPuppeteer.resetBrowser()
    await page.goto(baseUrl)
  })

  beforeEach(async () => {
    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 2000))
  })

  describe('Initial loading', () => {
    it('successfully loads', async () => {
      // App should load the Orbit login screen
      await page.waitForSelector('h1')
      await expect(page).toMatchElement('h1', { text: 'Orbit' })
    })
  })

  describe('Log in', () => {
    it('is able to log in', async () => {
      // Wait for the username input, write username and press enter to log in
      await page.waitForSelector('.LoginView input[type=text]')
      await expect(page).toFill('.LoginView input[type=text]', username)
      await page.keyboard.press('Enter')

      // Wait for the default channel to show up, press the menu button to open the side panel
      await page.waitForSelector('.Header .open-controlpanel')
      await expect(page).toClick('.Header .open-controlpanel')

      // Shown username should match and the darkener(curtain) element should be visible
      await page.waitForSelector('.username')
      await page.waitForSelector('.darkener')
      await expect(page).toMatchElement('.username', { text: username })
      await expect(page).toClick('.darkener')
    })
  })

  describe('Joining default channels', () => {
    it('joins #orbit-dev by default', async () => {
      // New user should join #orbit-dev by default with the channel opened
      await page.waitForSelector('.Controls .SendMessage input[type=text]')
      await page.waitForSelector('.Header .currentChannel')
      await expect(page).toMatchElement('.Header .currentChannel', {
        text: '#orbit-dev'
      })
    })
  })

  describe('First channel', () => {
    describe('Joining', () => {
      it('joins a channel', async () => {
        // Open control panel
        await page.waitForSelector('.Header .open-controlpanel')
        await expect(page).toClick('.Header .open-controlpanel')

        // Fill in channel name and press enter
        await page.waitForSelector('.JoinChannel input[type=text]')
        await expect(page).toFill('.JoinChannel input[type=text]', testChannel1)
        await page.keyboard.press('Enter')

        // Current channel name should match
        await page.waitForSelector('.Header .currentChannel')
        await expect(page).toMatchElement('.Header .currentChannel', {
          text: `#${testChannel1}`
        })
      })
    })

    describe('Sending', () => {
      it('sends a message to channel', async () => {
        // Make sure we are in the right channel
        await page.waitForSelector('.Header .currentChannel')
        await expect(page).toMatchElement('.Header .currentChannel', {
          text: `#${testChannel1}`
        })

        // Create a unique, timestamped message
        timedMessage = testMessage + Date.now()

        // Fill in a message and send it
        await page.waitForSelector('.SendMessage input[type=text]')
        await expect(page).toFill('.SendMessage input[type=text]', timedMessage)
        await page.keyboard.press('Enter')

        // The sent message should show up in messages
        await page.waitForSelector('.TextMessage div')
        await expect(page).toMatchElement('.TextMessage div', { text: timedMessage })
      })

      it('sends a video file to channel', async () => {
        // Make sure we are in the right channel
        await page.waitForSelector('.Header .currentChannel')
        await expect(page).toMatchElement('.Header .currentChannel', {
          text: `#${testChannel1}`
        })

        // Upload the sample video from test directory to testchannel
        await page.waitForSelector('#file')
        const fileInput = await page.$('#file')
        await fileInput.uploadFile(path.join(__dirname, 'sample.mp4'))

        // The uploaded video's name should show in messages
        await page.waitForSelector('.FileMessage .name')
        /* await expect(page).toClick('.FileMessage .name')

        // When the video's name is pressed, the video should be opened and start playing
        await page.waitForSelector('.FilePreview video')
        const videoElement = await page.$('.FilePreview video')
        await expect(videoElement.paused).toBe(false) */
      })

      it('sends another message to channel', async () => {
        // Make sure we are in the right channel
        await page.waitForSelector('.Header .currentChannel')
        await expect(page).toMatchElement('.Header .currentChannel', {
          text: `#${testChannel1}`
        })

        // Create a unique, timestamped message
        timedMessage2 = testMessage + " I'm second " + Date.now()

        // Fill in a message and send it
        await page.waitForSelector('.SendMessage input[type=text]')
        await expect(page).toFill('.SendMessage input[type=text]', timedMessage2)
        await page.keyboard.press('Enter')

        // The sent message should show up in messages
        await page.waitForSelector('.TextMessage div')
        await expect(page).toMatchElement('.TextMessage div', { text: timedMessage2 })
      })
    })
  })

  describe('Second channel', () => {
    describe('Joining', () => {
      it('is able to join another channel', async () => {
        // Open control panel
        await page.waitForSelector('.Header .open-controlpanel')
        await expect(page).toClick('.Header .open-controlpanel')

        // Write the channel name, press enter
        await page.waitForSelector('.JoinChannel input[type=text]')
        await expect(page).toFill('.JoinChannel input[type=text]', testChannel2)
        await page.keyboard.press('Enter')

        // Current channel should match
        await page.waitForSelector('.Header .currentChannel')
        await expect(page).toMatchElement('.Header .currentChannel', {
          text: `#${testChannel2}`
        })
      })
    })

    describe('Sending', () => {
      it('sends a message to another channel', async () => {
        // Create a unique, timestamped message
        timedMessage3 = testMessage + Date.now()

        // Type in the message, press enter to send it
        await page.waitForSelector('.SendMessage input[type=text]')
        await expect(page).toFill('.SendMessage input[type=text]', timedMessage3)
        await page.keyboard.press('Enter')

        // The sent message should show up in messages
        await page.waitForSelector('.TextMessage div')
        await expect(page).toMatchElement('.TextMessage div', { text: timedMessage3 })
      })
    })
  })

  describe('Changing channels', () => {
    it('is able to change channels', async () => {
      // Open control panel
      await page.waitForSelector('.Header .open-controlpanel')
      await expect(page).toClick('.Header .open-controlpanel')

      // Change channel
      await page.waitForSelector('.ControlPanel .channelsList .ChannelLink')
      await expect(page).toClick('.ControlPanel .channelsList .ChannelLink', {
        text: `#${testChannel1}`
      })

      // Channel name should match
      await page.waitForSelector('.Header .currentChannel')
      await expect(page).toMatchElement('.Header .currentChannel', {
        text: `#${testChannel1}`
      })
    })

    it('persists messages between channel changes', async () => {
      // Both previously sent messages should be loaded
      await page.waitForSelector('.Channel .Messages .Message')
      await expect(page).toMatch(timedMessage)
      await expect(page).toMatch(timedMessage2)

      // Open control panel
      await page.waitForSelector('.Header .open-controlpanel')
      await expect(page).toClick('.Header .open-controlpanel')

      // Change channel
      await page.waitForSelector('.ControlPanel .channelsList .ChannelLink')
      await expect(page).toClick('.ControlPanel .channelsList .ChannelLink', {
        text: `#${testChannel2}`
      })

      // A previously sent message should be loaded on join in other channel
      await page.waitForSelector('.Channel .Messages .Message')
      await expect(page).toMatch(timedMessage3)
    })
  })

  describe('Log out', () => {
    it('user is able to log out', async () => {
      // Press the current channel's name to open the sidebar
      await page.waitForSelector('.Header .open-controlpanel ')
      await expect(page).toClick('.Header .open-controlpanel ')

      // Wait for logout button, click it
      await page.waitForSelector('.flaticon-prohibition35')
      await expect(page).toClick('.flaticon-prohibition35')

      // App should load the Orbit login screen
      await page.waitForSelector('h1')
      await expect(page).toMatchElement('h1', { text: 'Orbit' })
    })
  })

  describe.skip('Persistence', () => {
    it('persists channels and their messages between logins', async () => {
      // Wait for the username input, write "testuser" and press enter to log in
      await page.waitForSelector('input[type=text]')
      await expect(page).toFill('input[type=text]', username)
      await page.keyboard.press('Enter')

      // Press the current channel's name to open the sidebar
      await page.waitForSelector('.Header .open-controlpanel')
      await expect(page).toClick('.Header .open-controlpanel')

      // Expect recent channels to be shown in the side panel
      await page.waitForSelector('.ChannelLink')
      await expect(page).toMatchElement('.ChannelLink', {
        text: '#orbitdb'
      })
      await expect(page).toMatchElement('.ChannelLink', {
        text: `#${testChannel1}`
      })
      await expect(page).toMatchElement('.ChannelLink', {
        text: `#${testChannel2}`
      })

      // Join #testchannel
      await expect(page).toClick('.ChannelLink', { text: `#${testChannel1}` })

      // Both previously sent messages should be loaded in "testchannel"
      await page.waitForSelector('.Channel .Messages .Message')
      await expect(page).toMatch(timedMessage)
      await expect(page).toMatch(timedMessage2)
    })
  })
})
