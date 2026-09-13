# Usage

- [Usage](#usage)
  - [Getting Started](#getting-started)
  - [Events](#events)
  - [WebHooks](#webhooks)
  - [Sending Files](#sending-files)
    - [File Options (metadata)](#file-options-metadata)
    - [Performance Issue](#performance-issue)
  - [Rich Messages (Bot API 10.1+)](#rich-messages-bot-api-101)
  - [Ephemeral Messages (Bot API 10.2+)](#ephemeral-messages-bot-api-102)
  - [Guest Mode (Bot API 10.0+)](#guest-mode-bot-api-100)
  - [Business Accounts (Bot API 9.0+)](#business-accounts-bot-api-90)
  - [Gifts & Stars (Bot API 8.0+)](#gifts--stars-bot-api-80)
  - [Checklists (Bot API 9.1+)](#checklists-bot-api-91)
  - [Polls (Advanced)](#polls-advanced)
  - [Live Photos (Bot API 10.0+)](#live-photos-bot-api-100)
  - [Stories (Bot API 9.0+)](#stories-bot-api-90)
  - [Communities (Bot API 10.2+)](#communities-bot-api-102)
  - [Suggested Posts (Bot API 9.2+)](#suggested-posts-bot-api-92)
  - [Managed Bots (Bot API 9.6+)](#managed-bots-bot-api-96)
  - [Inline Mode](#inline-mode)
  - [File Options](#file-options)
  - [Error Handling](#error-handling)


<a name="getting-started"></a>
## Getting Started

Install the package:

```sh
npm i @zero-bot.net/tg-bot-api
```

Create a bot using long polling:

```js
const TelegramBot = require('@zero-bot.net/tg-bot-api');

const bot = new TelegramBot('YOUR_TOKEN', { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Hello!');
});
```

Or use a webhook:

```js
const bot = new TelegramBot('YOUR_TOKEN', {
  webHook: { port: 8443 },
});

bot.setWebHook('https://your-domain.com:8443', {
  certificate: 'path/to/crt.pem',
});
```

**Constructor options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `polling` | `Boolean\|Object` | `false` | Enable long polling |
| `polling.interval` | `Number` | `300` | Interval between requests in ms |
| `polling.autoStart` | `Boolean` | `true` | Start polling immediately |
| `polling.params` | `Object` | `{}` | Parameters for `getUpdates` |
| `webHook` | `Boolean\|Object` | `false` | Enable webhook |
| `webHook.host` | `String` | `"0.0.0.0"` | Host to bind to |
| `webHook.port` | `Number` | `8443` | Port to bind to |
| `webHook.key` | `String` | — | Path to PEM private key |
| `webHook.cert` | `String` | — | Path to PEM certificate |
| `webHook.pfx` | `String` | — | Path to PFX key+cert |
| `webHook.autoOpen` | `Boolean` | `true` | Open webhook immediately |
| `webHook.healthEndpoint` | `String` | `"/healthz"` | Health check endpoint |
| `baseApiUrl` | `String` | `"https://api.telegram.org"` | API base URL |
| `filepath` | `Boolean` | `true` | Allow file paths as arguments |
| `onlyFirstMatch` | `Boolean` | `false` | Stop after first `onText` match |
| `request` | `Object` | — | Options added to all API requests |
| `testEnvironment` | `Boolean` | `false` | Use test environment |


<a name="events"></a>
## Events

*TelegramBot* extends [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter) and emits all [Telegram Update types](https://core.telegram.org/bots/api#update) plus library-specific error events.

### Message Events

These events fire when a new message arrives.

| Event | Description |
|-------|-------------|
| `message` | Any incoming [Message](https://core.telegram.org/bots/api#message) |
| `edited_message` | A message that was edited |
| `channel_post` | New channel post |
| `edited_channel_post` | A channel post that was edited |

**Arguments:** `(message, metadata)` where `metadata.type` identifies the message sub-type.

### Message Sub-Events

When a `message` arrives, the library also emits a **sub-event** based on the content type. All of these are listed in `TelegramBot.messageTypes`:

| Sub-Event | Description |
|-----------|-------------|
| `text` | Text message |
| `animation` | GIF or animated file |
| `audio` | Audio file (.MP3, .M4A) |
| `document` | General file |
| `photo` | Photo |
| `sticker` | Sticker |
| `video` | Video file |
| `video_note` | Round video message |
| `voice` | Voice message |
| `contact` | Phone contact |
| `location` | Geographic location |
| `dice` | Animated dice |
| `game` | Game |
| `invoice` | Invoice message |
| `successful_payment` | Successful payment |
| `refunded_payment` | Refunded payment (Bot API 7.7+) |
| `poll` | Poll update |
| `new_chat_members` | New members added |
| `left_chat_member` | Member left |
| `new_chat_title` | Chat title changed |
| `new_chat_photo` | Chat photo changed |
| `delete_chat_photo` | Chat photo deleted |
| `group_chat_created` | Group chat created |
| `supergroup_chat_created` | Supergroup created |
| `channel_chat_created` | Channel created |
| `pinned_message` | Message pinned |
| `passport_data` | Telegram Passport data |
| `migrate_from_chat_id` | Migrated from chat |
| `migrate_to_chat_id` | Migrated to chat |
| `video_chat_started` | Voice/video chat started |
| `video_chat_ended` | Voice/video chat ended |
| `video_chat_participants_invited` | Video chat invite |
| `video_chat_scheduled` | Video chat scheduled |
| `message_auto_delete_timer_changed` | Auto-delete timer changed |
| `chat_invite_link` | Invite link created |
| `chat_member_updated` | Chat member status updated |
| `web_app_data` | Web App data received |
| `message_reaction` | Reaction on a message changed |
| `giveaway_created` | Giveaway created (Bot API 8.3+) |
| `giveaway` | Giveaway message (Bot API 8.3+) |
| `giveaway_winners` | Giveaway winners (Bot API 8.3+) |
| `giveaway_completed` | Giveaway completed (Bot API 8.3+) |
| `chat_boost_added` | Chat boosted (Bot API 8.3+) |
| `story` | Story posted (Bot API 8.3+) |
| `chat_background_set` | Chat background set (Bot API 8.3+) |
| `forum_topic_created` | Forum topic created (Bot API 8.3+) |
| `forum_topic_closed` | Forum topic closed (Bot API 8.3+) |
| `forum_topic_reopened` | Forum topic reopened (Bot API 8.3+) |
| `forum_topic_edited` | Forum topic edited (Bot API 8.3+) |
| `general_forum_topic_hidden` | General topic hidden (Bot API 8.3+) |
| `general_forum_topic_unhidden` | General topic unhidden (Bot API 8.3+) |
| `write_access_allowed` | Bot allowed to send messages (Bot API 8.3+) |
| `boost` | Boost added to chat (Bot API 8.3+) |
| `gift` | Gift received (Bot API 9.0+) |
| `unique_gift` | Unique gift received (Bot API 9.0+) |
| `paid_message_price_changed` | Paid message price changed (Bot API 9.0+) |
| `paid_star_count` | Star count for paid message (Bot API 9.0+) |
| `checklist` | Checklist sent (Bot API 9.1+) |
| `checklist_tasks_done` | Checklist tasks completed (Bot API 9.1+) |
| `checklist_tasks_added` | Checklist tasks added (Bot API 9.1+) |
| `direct_message_price_changed` | Direct message price changed (Bot API 9.1+) |
| `direct_messages_topic` | Direct messages topic created (Bot API 9.2+) |
| `suggested_post_info` | Suggested post info (Bot API 9.2+) |
| `suggested_post_approved` | Suggested post approved (Bot API 9.2+) |
| `suggested_post_approval_failed` | Suggested post approval failed (Bot API 9.2+) |
| `suggested_post_declined` | Suggested post declined (Bot API 9.2+) |
| `suggested_post_paid` | Suggested post paid (Bot API 9.2+) |
| `suggested_post_refunded` | Suggested post refunded (Bot API 9.2+) |
| `gift_upgrade_sent` | Gift upgrade sent (Bot API 9.3+) |
| `chat_owner_left` | Chat owner left (Bot API 9.4+) |
| `chat_owner_changed` | Chat owner changed (Bot API 9.4+) |
| `sender_tag` | Sender tag received (Bot API 9.5+) |
| `managed_bot_created` | Managed bot created (Bot API 9.6+) |
| `poll_option_added` | Poll option added (Bot API 9.6+) |
| `poll_option_deleted` | Poll option deleted (Bot API 9.6+) |
| `guest_bot_caller_user` | Guest bot caller user (Bot API 10.0+) |
| `guest_bot_caller_chat` | Guest bot caller chat (Bot API 10.0+) |
| `guest_query_id` | Guest query ID (Bot API 10.0+) |
| `live_photo` | Live photo received (Bot API 10.0+) |
| `rich_message` | Rich message received (Bot API 10.1+) |
| `ephemeral_message_id` | Ephemeral message ID (Bot API 10.2+) |
| `receiver_user` | Receiver user for community message (Bot API 10.2+) |
| `community_chat_added` | Community chat added (Bot API 10.2+) |
| `community_chat_removed` | Community chat removed (Bot API 10.2+) |
| `community_chat_joined` | Community chat joined (Bot API 10.3+) |
| `stopped_message_generation` | Message generation stopped (Bot API 10.3+) |

### Edited Message Sub-Events

| Event | Description |
|-------|-------------|
| `edited_message_text` | Text of an edited message |
| `edited_message_caption` | Caption of an edited message |
| `edited_channel_post_text` | Text of an edited channel post |
| `edited_channel_post_caption` | Caption of an edited channel post |

### Query Events

| Event | Description |
|-------|-------------|
| `callback_query` | Callback query from inline keyboard |
| `inline_query` | Inline query |
| `chosen_inline_result` | Result chosen by user from inline query |
| `shipping_query` | Shipping query for payments |
| `pre_checkout_query` | Pre-checkout query for payments |

### Chat Member Events

| Event | Description |
|-------|-------------|
| `chat_member` | Chat member's status updated |
| `my_chat_member` | Bot's chat member status updated |
| `chat_join_request` | Request to join chat sent |
| `chat_boost` | Chat boost added |
| `removed_chat_boost` | Chat boost removed |

### Business Events

| Event | Description |
|-------|-------------|
| `business_connection` | Business connection established |
| `business_message` | Message in a business chat |
| `edited_business_message` | Edited message in a business chat |
| `deleted_business_messages` | Messages deleted in a business chat |
| `purchased_paid_media` | Paid media purchased |
| `subscription` | Subscription event |
| `managed_bot` | Managed bot event |
| `guest_message` | Message from guest mode |
| `stopped_message_generation` | Message generation stopped (Bot API 10.3+) |
| `reaction` | Reaction event |

### Message Reaction Events

| Event | Description |
|-------|-------------|
| `message_reaction` | Message reaction changed |
| `message_reaction_count` | Message reaction count changed |

### Library Error Events

| Event | Description |
|-------|-------------|
| `polling_error` | Error during long polling |
| `webhook_error` | Error handling a webhook request |
| `error` | Unexpected fatal error |

### Examples

```js
// Listen for any message
bot.on('message', (msg, metadata) => {
  console.log(`Received ${metadata.type} message in chat ${msg.chat.id}`);
});

// Listen for specific message types
bot.on('text', (msg) => {
  bot.sendMessage(msg.chat.id, `You said: ${msg.text}`);
});

bot.on('photo', (msg) => {
  const photo = msg.photo[msg.photo.length - 1]; // highest resolution
  bot.sendMessage(msg.chat.id, `Photo ${photo.file_id}`);
});

bot.on('callback_query', (query) => {
  bot.answerCallbackQuery(query.id, { text: 'Got it!' });
});

// Business events (Bot API 9.0+)
bot.on('business_message', (msg) => {
  console.log('Business message:', msg.text);
  bot.readBusinessMessage(msg.business_connection_id, msg.message_id);
});

// Guest mode (Bot API 10.0+)
bot.on('guest_message', (msg) => {
  console.log('Guest message:', msg.text);
});

// Reaction events
bot.on('message_reaction', (reaction) => {
  console.log('Reaction changed:', reaction);
});
```

**Tip:** It is much better to listen on a specific event rather than on `message` to stay safe from the content.

**Tip:** Bot must be enabled on [inline mode][inline-mode] to receive inline queries.


<a name="webhooks"></a>
## WebHooks

Telegram only supports HTTPS connections to WebHooks. You need an SSL certificate.
Since August 29, 2015 Telegram supports self-signed ones:

```bash
# Private key
openssl genrsa -out key.pem 2048

# Public certificate
openssl req -new -sha256 -key key.pem -out crt.pem
```

Set up the webhook:

```js
bot.setWebHook('https://public-url.com:8443', {
  certificate: 'path/to/crt.pem',
  secret_token: 'your-secret-token',
});
```

Use the built-in webhook server:

```js
const bot = new TelegramBot(token, {
  webHook: {
    host: '0.0.0.0',
    port: 8443,
    key: 'path/to/key.pem',
    cert: 'path/to/crt.pem',
    healthEndpoint: '/healthz',
  },
});

// Optionally set the webhook from the bot
bot.setWebHook('https://your-domain.com:8443');
```

Verify webhook status:

```js
const info = await bot.getWebHookInfo();
console.log(info.url, info.pending_update_count);
```

Delete webhook to switch back to polling:

```js
await bot.deleteWebHook();
bot.startPolling();
```

**Note:** If you encounter `Error: error:0906D06C:PEM routines:PEM_read_bio:no start line`, check [this issue][issue-63].


<a name="sending-files"></a>
## Sending Files

The library supports sending files as **file paths**, **Readable Streams**, **Buffers**, or **file IDs**.

### File Paths

```js
bot.sendPhoto(chatId, 'path/to/photo.jpg');
bot.sendAudio(chatId, 'path/to/song.mp3');
bot.sendDocument(chatId, 'path/to/document.pdf');
```

### Streams

```js
const fs = require('fs');

const stream = fs.createReadStream('path/to/video.mp4');
bot.sendVideo(chatId, stream);
```

### Buffers

```js
const buffer = fs.readFileSync('path/to/image.png');
bot.sendPhoto(chatId, buffer);
```

### File IDs

Reuse previously uploaded files by passing the `file_id`:

```js
bot.sendSticker(chatId, 'CAACAgIAAxkBAAI...');
```

### HTTP URLs

Some methods accept HTTP URLs that Telegram will download:

```js
bot.sendPhoto(chatId, 'https://example.com/photo.jpg');
```

### Sending Albums

```js
bot.sendMediaGroup(chatId, [
  { type: 'photo', media: 'path/to/photo1.jpg' },
  { type: 'photo', media: 'path/to/photo2.jpg' },
  { type: 'video', media: 'path/to/video.mp4' },
]);
```

### Downloading Files

```js
// Get file info
const fileInfo = await bot.getFile('file_id');
console.log(fileInfo.file_path);

// Get a download link (valid 1 hour)
const link = await bot.getFileLink('file_id');

// Download as stream
const fileStream = bot.getFileStream('file_id');
fileStream.pipe(fs.createWriteStream('downloaded.jpg'));

// Download to a directory
const filePath = await bot.downloadFile('file_id', '/path/to/downloads');
```


<a name="sending-files-options"></a>
### File Options (metadata)

When sending files, you can explicitly specify the filename and MIME type:

```js
bot.sendAudio(chatId, buffer, {}, {
  filename: 'mysong.mp3',
  contentType: 'audio/mpeg',
});
```

**Note:** You **MUST** provide an empty object (`{}`) for additional Telegram query options if you only want to set file options:

```js
// WRONG — fileOptions will be taken as query options
bot.sendAudio(chatId, data, fileOptions);

// RIGHT
bot.sendAudio(chatId, data, {}, fileOptions);
```

When `NTBA_FIX_350` is set, the library auto-resolves `filename` and `contentType` from the source.


<a name="sending-files-performance"></a>
### Performance Issue

Disable file-path resolution for maximum performance:

```js
const bot = new TelegramBot(token, {
  filepath: false,
});
```

You will need to use Streams or Buffers instead of file paths.


<a name="rich-messages"></a>
## Rich Messages (Bot API 10.1+)

Rich messages support AI-generated streaming responses, structured content, and inline buttons. They are sent via `sendRichMessage` with an `InputRichMessageContent` object.

### Sending Rich Messages

```js
// Send a rich message with structured content
bot.sendRichMessage(chatId, {
  text: 'Hello world!',
  format: 'html',
  buttons: [
    { text: 'Click me', callback_data: 'btn_click' },
  ],
});
```

### Rich Message Drafts

Send a draft that the user can preview before sending:

```js
bot.sendRichMessageDraft(chatId, {
  text: 'Draft message with formatting',
  format: 'markdown',
});
```

### Listening for Rich Messages

```js
bot.on('rich_message', (msg) => {
  console.log('Rich message content:', msg.rich_message);
  console.log('Sender:', msg.from);
});
```

### Editing Ephemeral Rich Messages

```js
bot.editEphemeralMessageText(chatId, ephemeralMessageId, 'Updated text');
bot.editEphemeralMessageCaption(chatId, ephemeralMessageId, {
  caption: 'New caption',
});
bot.editEphemeralMessageReplyMarkup(chatId, ephemeralMessageId, {
  reply_markup: {
    inline_keyboard: [[{ text: 'New Button', callback_data: 'new' }]],
  },
});
```


<a name="ephemeral-messages"></a>
## Ephemeral Messages (Bot API 10.2+)

Ephemeral messages are temporary messages that can be edited, deleted, or have their reply markup updated. They receive an `ephemeral_message_id` in the update.

### Editing Ephemeral Messages

```js
// Edit text
await bot.editEphemeralMessageText(chatId, ephemeralMessageId, 'Updated text');

// Edit media
await bot.editEphemeralMessageMedia(chatId, ephemeralMessageId, {
  type: 'photo',
  media: 'attach://photo',
});

// Edit caption
await bot.editEphemeralMessageCaption(chatId, ephemeralMessageId, {
  caption: 'Updated caption',
});

// Edit reply markup
await bot.editEphemeralMessageReplyMarkup(chatId, ephemeralMessageId, {
  reply_markup: {
    inline_keyboard: [[{ text: 'Updated', callback_data: 'updated' }]],
  },
});
```

### Deleting Ephemeral Messages

```js
await bot.deleteEphemeralMessage(chatId, ephemeralMessageId);
```

### Receiving Ephemeral Message Events

```js
bot.on('ephemeral_message_id', (msg) => {
  const ephemeralId = msg.ephemeral_message_id;
  // Use ephemeralId for edit/delete operations
});
```


<a name="guest-mode"></a>
## Guest Mode (Bot API 10.0+)

Guest mode allows bots to interact with users who haven't started the bot yet. It enables receiving messages from users via Web Apps or QR code scans.

### Receiving Guest Messages

```js
bot.on('guest_message', (msg) => {
  console.log('Guest:', msg.from);
  console.log('Text:', msg.text);

  // You can reply to guest messages
  bot.sendMessage(msg.chat.id, 'Hello guest!');
});
```

### Answering Guest Queries

```js
bot.on('guest_query_id', (msg) => {
  const queryId = msg.guest_query_id;
  bot.answerGuestQuery(queryId, 'Response text');
});
```

### Guest Bot Callers

```js
bot.on('guest_bot_caller_user', (msg) => {
  console.log('Guest caller user:', msg.from);
});

bot.on('guest_bot_caller_chat', (msg) => {
  console.log('Guest caller chat:', msg.chat);
});
```


<a name="business-accounts"></a>
## Business Accounts (Bot API 9.0+)

Bots can manage Telegram Business accounts, read/delete messages, manage profiles, and handle paid messages.

### Reading Business Messages

```js
bot.on('business_message', (msg) => {
  const { business_connection_id, message_id } = msg;
  bot.readBusinessMessage(business_connection_id, message_id);
});
```

### Deleting Business Messages

```js
bot.deleteBusinessMessages(businessConnectionId, [101, 102, 103]);
```

### Managing Business Account Profile

```js
// Change name
await bot.setBusinessAccountName(businessConnectionId, {
  first_name: 'New',
  last_name: 'Name',
});

// Change username
await bot.setBusinessAccountUsername(businessConnectionId, {
  username: 'newusername',
});

// Change bio
await bot.setBusinessAccountBio(businessConnectionId, {
  bio: 'New business bio',
});

// Change profile photo
await bot.setBusinessAccountProfilePhoto(businessConnectionId, {
  type: 'photo',
  photo: { ... },
});

// Remove profile photo
await bot.removeBusinessAccountProfilePhoto(businessConnectionId);
```

### Managing Business Stars

```js
// Get Star balance
const balance = await bot.getBusinessAccountStarBalance(businessConnectionId);
console.log(balance);

// Transfer Stars to bot owner
await bot.transferBusinessAccountStars(businessConnectionId, 100);
```

### Managing Business Gift Settings

```js
await bot.setBusinessAccountGiftSettings(businessConnectionId, {
  accepted_gift_types: {
    regular_gifts: true,
    premium_gifts: false,
    unique_gifts: true,
  },
});
```

### Getting Business Connection Info

```js
const connection = await bot.getBusinessConnection(businessConnectionId);
console.log(connection);
```

### Business Message Events

```js
bot.on('business_message', (msg) => {
  // New message in business chat
  console.log('Business msg:', msg.text);
});

bot.on('edited_business_message', (msg) => {
  // Edited business message
  console.log('Edited:', msg.text);
});

bot.on('deleted_business_messages', (msg) => {
  // Messages deleted in business chat
  console.log('Deleted:', msg.message_ids);
});
```


<a name="gifts-stars"></a>
## Gifts & Stars (Bot API 8.0+)

### Getting Available Gifts

```js
const gifts = await bot.getAvailableGifts();
console.log(gifts); // Gifts object with array of Gift
```

### Sending a Gift

```js
// Send to a user
await bot.sendGift(userId, giftId);

// Send to a channel
await bot.sendGift(channelId, giftId, { text: 'Congratulations!' });
```

### Receiving Gift Events

```js
bot.on('gift', (msg) => {
  console.log('Gift received:', msg.gift);
});

bot.on('unique_gift', (msg) => {
  console.log('Unique gift:', msg.unique_gift);
});
```

### Managing Owned Gifts

```js
// Get gifts received by a user
const userGifts = await bot.getUserGifts(userId);

// Get gifts in a chat
const chatGifts = await bot.getChatGifts(chatId);

// Get business account gifts
const bizGifts = await bot.getBusinessAccountGifts(businessConnectionId);
```

### Gift Conversions and Upgrades

```js
// Convert a gift to Stars
const stars = await bot.convertGiftToStars(businessConnectionId, ownedGiftId);

// Upgrade a gift
const upgraded = await bot.upgradeGift(businessConnectionId, ownedGiftId);

// Transfer a gift to another user
await bot.transferGift(businessConnectionId, ownedGiftId, newOwnerChatId);

// Upgrade sent notification
bot.on('gift_upgrade_sent', (msg) => {
  console.log('Gift upgraded:', msg);
});
```

### Telegram Stars

```js
// Get Star balance
const balance = await bot.getMyStarBalance();
console.log(balance);

// Get Star transactions
const txns = await bot.getStarTransactions();

// Refund a Star payment
await bot.refundStarPayment(userId, telegramPaymentChargeId);
```

### Payments & Subscriptions

```js
// Get paid media purchases
bot.on('purchased_paid_media', (update) => {
  console.log('Paid media purchased:', update);
});

// Get subscription events
bot.on('subscription', (update) => {
  console.log('Subscription event:', update);
});

// Send paid media
await bot.sendPaidMedia(chatId, starCount, [
  { type: 'photo', media: 'photo_id' },
  { type: 'video', media: 'video_id' },
]);

// Edit Star subscription
await bot.editUserStarSubscription(userId, telegramPaymentChargeId, true);

// Gift Premium subscription
await bot.giftPremiumSubscription(userId, monthCount, starCount);
```


<a name="checklists"></a>
## Checklists (Bot API 9.1+)

Checklists allow businesses to send task lists to users.

### Sending a Checklist

```js
await bot.sendChecklist(businessConnectionId, 'Meeting Agenda', [
  { text: 'Review budget', is_done: false },
  { text: 'Discuss timeline', is_done: false },
  { text: 'Assign tasks', is_done: true },
]);
```

### Editing a Checklist

```js
await bot.editMessageChecklist(businessConnectionId, messageId, {
  tasks: [
    { text: 'Review budget', is_done: true },
    { text: 'Discuss timeline', is_done: true },
    { text: 'Assign tasks', is_done: true },
  ],
});
```

### Receiving Checklist Events

```js
bot.on('checklist', (msg) => {
  console.log('Checklist:', msg.checklist);
});

bot.on('checklist_tasks_done', (msg) => {
  console.log('Tasks completed:', msg.checklist_tasks_done);
});

bot.on('checklist_tasks_added', (msg) => {
  console.log('Tasks added:', msg.checklist_tasks_added);
});
```


<a name="polls"></a>
## Polls (Advanced)

### Sending a Poll

```js
bot.sendPoll(chatId, 'What is your favorite color?', [
  { text: 'Red' },
  { text: 'Blue' },
  { text: 'Green' },
], {
  is_anonymous: true,
  type: 'regular', // or 'quiz'
  allows_multiple_answers: false,
});
```

### Stopping a Poll

```js
const stoppedPoll = await bot.stopPoll(chatId, pollMessageId);
console.log(stoppedPoll.options); // Final results
```

### Poll Events

```js
bot.on('poll', (poll) => {
  console.log('Poll update:', poll.id, poll.total_voter_count);
});

bot.on('poll_answer', (answer) => {
  console.log('User', answer.user.id, 'voted:', answer.option_ids);
});

// Bot API 9.6+ poll option events
bot.on('poll_option_added', (update) => {
  console.log('Poll option added:', update);
});

bot.on('poll_option_deleted', (update) => {
  console.log('Poll option deleted:', update);
});
```


<a name="live-photos"></a>
## Live Photos (Bot API 10.0+)

Live photos combine a still image with a short video, similar to Apple's Live Photos.

### Sending a Live Photo

```js
await bot.sendLivePhoto(chatId, 'photo.jpg', 'video.mp4', {
  caption: 'My live photo!',
});
```

Using file IDs or streams:

```js
await bot.sendLivePhoto(chatId, photoFileId, videoFileId);
```

### Receiving Live Photos

```js
bot.on('live_photo', (msg) => {
  const livePhoto = msg.live_photo;
  console.log('Photo:', livePhoto.photo);
  console.log('Video:', livePhoto.video);
});
```


<a name="stories"></a>
## Stories (Bot API 9.0+)

Bots can post, edit, and delete stories on behalf of managed business accounts.

### Posting a Story

```js
await bot.postStory(businessConnectionId, {
  type: 'photo',
  photo: { /* InputStoryContentPhoto */ },
  caption: 'Check out our new product!',
  area: { /* Interactive area */ },
});
```

### Editing a Story

```js
await bot.editStory(businessConnectionId, storyId, {
  content: {
    type: 'photo',
    photo: { /* updated content */ },
  },
});
```

### Deleting a Story

```js
await bot.deleteStory(businessConnectionId, storyId);
```

### Reposting a Story

```js
await bot.repostStory(businessConnectionId, storyId, [targetConnectionId1, targetConnectionId2]);
```

### Receiving Story Events

```js
bot.on('story', (msg) => {
  console.log('Story posted:', msg.story);
});
```


<a name="communities"></a>
## Communities (Bot API 10.2+)

Communities allow managing multiple linked chats under a single umbrella.

### Receiving Community Events

```js
bot.on('community_chat_added', (msg) => {
  console.log('Community chat added:', msg.chat);
});

bot.on('community_chat_removed', (msg) => {
  console.log('Community chat removed:', msg.chat);
});

bot.on('community_chat_joined', (msg) => {
  console.log('Community chat joined:', msg.chat);
});
```

### Receiver User Events

When a message is forwarded to a community, the `receiver_user` event identifies the recipient:

```js
bot.on('receiver_user', (msg) => {
  console.log('Message for user:', msg.receiver_user);
});
```


<a name="suggested-posts"></a>
## Suggested Posts (Bot API 9.2+)

Suggested posts allow channel admins to review posts submitted by managed bots before publishing.

### Approving or Declining a Suggested Post

```js
// Approve
await bot.approveSuggestedPost(businessConnectionId, messageId);

// Decline
await bot.declineSuggestedPost(businessConnectionId, messageId);
```

### Receiving Suggested Post Events

```js
bot.on('suggested_post_info', (msg) => {
  console.log('New suggested post:', msg.suggested_post_info);
});

bot.on('suggested_post_approved', (msg) => {
  console.log('Post approved:', msg);
});

bot.on('suggested_post_approval_failed', (msg) => {
  console.log('Approval failed:', msg);
});

bot.on('suggested_post_declined', (msg) => {
  console.log('Post declined:', msg);
});

bot.on('suggested_post_paid', (msg) => {
  console.log('Post paid:', msg);
});

bot.on('suggested_post_refunded', (msg) => {
  console.log('Post refunded:', msg);
});
```


<a name="managed-bots"></a>
## Managed Bots (Bot API 9.6+)

Managed bots allow one bot to control another bot's token and access settings.

### Managing Bot Tokens

```js
// Get current token
const tokenInfo = await bot.getManagedBotToken(botId);
console.log(tokenInfo);

// Replace with a new token
const newToken = await bot.replaceManagedBotToken(botId);
console.log(newToken);
```

### Access Settings

```js
// Get access settings
const settings = await bot.getManagedBotAccessSettings();

// Set access settings
await bot.setManagedBotAccessSettings({
  restricted_channels: [channelId1, channelId2],
});
```

### Managed Bot Events

```js
bot.on('managed_bot', (update) => {
  console.log('Managed bot event:', update);
});

bot.on('managed_bot_created', (msg) => {
  console.log('Managed bot created:', msg);
});
```

### Saved Keyboard Buttons

```js
const saved = await bot.savePreparedKeyboardButton({
  text: 'Click me',
  web_app: { url: 'https://example.com' },
});
console.log(saved); // PreparedKeyboardButton
```


<a name="inline-mode"></a>
## Inline Mode

Bots must be enabled for [inline mode][inline-mode] via @BotFather.

### Answering Inline Queries

```js
bot.on('inline_query', (query) => {
  const results = [
    {
      type: 'article',
      id: '1',
      title: 'Result',
      input_message_content: {
        message_text: 'You selected: ' + query.query,
      },
    },
  ];

  bot.answerInlineQuery(query.id, results, { cache_time: 0 });
});
```

### Chosen Inline Results

```js
bot.on('chosen_inline_result', (result) => {
  console.log('User chose result:', result.result_id);
  console.log('From:', result.from);
});
```

### Web App Queries

```js
bot.on('web_app_query', (query) => {
  // Handle Web App inline queries
});

// Answer a Web App query
await bot.answerWebAppQuery(queryId, {
  type: 'article',
  id: '1',
  title: 'Result',
  input_message_content: { message_text: 'Done!' },
});
```

### Prepared Inline Messages (Bot API 8.0+)

```js
const prepared = await bot.savePreparedInlineMessage(userId, {
  type: 'article',
  id: '1',
  title: 'Prepared',
  input_message_content: { message_text: 'Prepared message' },
});
console.log(prepared); // PreparedInlineMessage
```


<a name="file-options"></a>
## File Options

### Getting File Info

```js
const file = await bot.getFile('file_id');
console.log(file.file_id, file.file_size, file.file_path);
```

### Getting File Links

```js
const link = await bot.getFileLink('file_id');
// Returns: https://api.telegram.org/file/bot<TOKEN>/<file_path>
```

### Getting File Streams

```js
const stream = bot.getFileStream('file_id');
stream.on('info', (info) => {
  console.log('File URI:', info.uri);
});
stream.pipe(fs.createWriteStream('downloaded.bin'));
```

### Downloading Files

```js
const filePath = await bot.downloadFile('file_id', './downloads');
console.log('Saved to:', filePath);
```

### User Profile Photos

```js
const photos = await bot.getUserProfilePhotos(userId, {
  offset: 0,
  limit: 10,
});
console.log(photos.photos); // Array of PhotoSize arrays
```


<a name="error-handling"></a>
## Error Handling

Every `Error` object has the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `code` | `String` | `EFATAL` (network), `EPARSE` (parse failure), `ETELEGRAM` (API error) |
| `response` | `IncomingMessage` | HTTP response (not available for `EFATAL`) |
| `response.body` | `String\|Object` | Error body — String for `EPARSE`, Object for `ETELEGRAM` |

### Error Types

```js
const { errors } = require('@zero-bot.net/tg-bot-api');

// errors.FatalError    — network/infra errors (code: EFATAL)
// errors.ParseError   — response couldn't be parsed (code: EPARSE)
// errors.TelegramError — Telegram API returned an error (code: ETELEGRAM)
```

### Handling API Errors

```js
bot.sendMessage(chatId, 'Hello').catch((error) => {
  if (error.code === 'ETELEGRAM') {
    console.log('Telegram error:', error.response.body);
    // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }
  } else if (error.code === 'EFATAL') {
    console.log('Network error:', error.message);
  } else if (error.code === 'EPARSE') {
    console.log('Parse error:', error.message);
  }
});
```

### General Error Handling

```js
bot.on('error', (error) => {
  console.error('Unexpected error:', error);
});

bot.on('polling_error', (error) => {
  console.error('Polling error:', error.code);
  // Decide whether to restart, alert, or crash
});

bot.on('webhook_error', (error) => {
  console.error('Webhook error:', error.code);
});
```


[update]: https://core.telegram.org/bots/api#update
[message]: https://core.telegram.org/bots/api#message
[callback-query]: https://core.telegram.org/bots/api#callbackquery
[inline-query]: https://core.telegram.org/bots/api#inlinequery
[chosen-inline-result]: https://core.telegram.org/bots/api#choseninlineresult
[inline-mode]: https://core.telegram.org/bots/api#inline-mode
[issue-63]: https://github.com/ZeroBot-net/tg-bot-api/issues/63
