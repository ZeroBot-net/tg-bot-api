# Bot API Features Reference (7.4 – 10.3)

A developer-friendly guide to all new features introduced in Telegram Bot API versions 7.4 through 10.3.

---

## Table of Contents

- [Rich Messages (Bot API 10.1+)](#rich-messages-bot-api-101)
- [Ephemeral Messages (Bot API 10.2+)](#ephemeral-messages-bot-api-102)
- [Guest Mode (Bot API 10.0+)](#guest-mode-bot-api-100)
- [Business Accounts (Bot API 9.0+)](#business-accounts-bot-api-90)
- [Gifts & Stars (Bot API 8.0+)](#gifts--stars-bot-api-80)
- [Checklists (Bot API 9.1+)](#checklists-bot-api-91)
- [Polls (Enhanced)](#polls-enhanced)
- [Live Photos (Bot API 10.0+)](#live-photos-bot-api-100)
- [Stories (Bot API 9.0+)](#stories-bot-api-90)
- [Communities (Bot API 10.2+)](#communities-bot-api-102)
- [Suggested Posts (Bot API 9.2+)](#suggested-posts-bot-api-92)
- [Managed Bots (Bot API 9.6+)](#managed-bots-bot-api-96)
- [Chat Subscriptions (Bot API 7.9+)](#chat-subscriptions-bot-api-79)
- [Verification (Bot API 8.2+)](#verification-bot-api-82)
- [Reactions (Bot API 10.0+)](#reactions-bot-api-100)
- [Keyboard Enhancements (Bot API 9.4–10.3)](#keyboard-enhancements-bot-api-94103)
- [Direct Messages in Channels (Bot API 9.2+)](#direct-messages-in-channels-bot-api-92)
- [Profile Management (Bot API 9.4–9.5)](#profile-management-bot-api-9495)
- [Paid Broadcast (Bot API 7.11+)](#paid-broadcast-bot-api-711)
- [Join Request Queries (Bot API 10.1+)](#join-request-queries-bot-api-101)

---

## Rich Messages (Bot API 10.1+)

Rich messages let you send structured, visually rich content beyond plain text — think product cards, media-rich previews, and formatted blocks with custom layouts.

### What It Is

A rich message contains an `InputRichMessageContent` object that describes structured content. Currently supported type is `product_info`, which renders a product card with title, description, and photo.

### Available Methods

```js
// Send a rich message
bot.sendRichMessage(chatId, {
  type: 'product_info',
  title: 'Wireless Headphones',
  description: 'Premium noise-cancelling headphones with 30hr battery',
  photo: '/path/to/headphones.jpg',
  parse_mode: 'HTML',
  entities: []
});

// Send a rich message draft (preview without finalizing)
bot.sendRichMessageDraft(chatId, {
  type: 'product_info',
  title: 'Wireless Headphones',
  description: 'Premium noise-cancelling headphones',
  photo: '/path/to/headphones.jpg'
});

// Edit a message to include rich content
bot.editMessageText('Updated message', {
  chat_id: chatId,
  message_id: messageId,
  rich_message: {
    type: 'product_info',
    title: 'Updated Product',
    description: 'New description'
  }
});
```

### Types

```ts
// Input content for sending
type InputRichMessageContent = InputRichMessageContentProductInfo;

interface InputRichMessageContentProductInfo {
  type: 'product_info';
  title: string;
  description?: string;
  photo?: InputFile;
  parse_mode?: string;
  entities?: MessageEntity[];
}

// Received content
interface RichMessageContent {
  type: string;
}

interface RichMessageProductInfo extends RichMessageContent {
  type: 'product_info';
  title: string;
  description?: string;
  photo?: PhotoSize[];
}
```

### Events

```js
// Listen for rich messages
bot.on('message', (msg) => {
  if (msg.rich_message) {
    console.log('Rich message type:', msg.rich_message.type);
  }
});
```

### Message Fields

| Field | Type | Description |
|-------|------|-------------|
| `rich_message` | `RichMessageContent` | The rich message content |

---

## Ephemeral Messages (Bot API 10.2+)

Ephemeral messages are messages that automatically disappear after a set period or can be explicitly deleted. They're useful for sensitive content, temporary notifications, and self-destructing information.

### How It Works

1. Set `ephemeral_message_parameters` on any send method
2. The message gets an `ephemeral_message_id` in response
3. Use that ID to edit or delete the ephemeral message
4. The message auto-deletes after the specified period

### Sending Ephemeral Messages

```js
// Send an ephemeral text message (disappears in 60 seconds)
bot.sendMessage(chatId, 'This will self-destruct in 60 seconds!', {
  ephemeral_message_parameters: {
    period: 60,
    is_persistent: true
  }
});

// Send an ephemeral photo
bot.sendPhoto(chatId, '/path/to/photo.jpg', {
  ephemeral_message_parameters: {
    period: 300  // 5 minutes
  }
});

// Ephemeral works with ALL send methods:
bot.sendVideo(chatId, videoFile, { ephemeral_message_parameters: { period: 120 } });
bot.sendDocument(chatId, docFile, { ephemeral_message_parameters: { period: 60 } });
bot.sendAudio(chatId, audioFile, { ephemeral_message_parameters: { period: 60 } });
bot.sendVoice(chatId, voiceFile, { ephemeral_message_parameters: { period: 60 } });
bot.sendSticker(chatId, stickerFile, { ephemeral_message_parameters: { period: 60 } });
bot.sendPoll(chatId, 'Question', ['A', 'B'], { ephemeral_message_parameters: { period: 60 } });
bot.sendLocation(chatId, lat, lng, { ephemeral_message_parameters: { period: 60 } });
bot.sendDice(chatId, { ephemeral_message_parameters: { period: 60 } });
bot.sendContact(chatId, phone, name, { ephemeral_message_parameters: { period: 60 } });
bot.sendVenue(chatId, lat, lng, title, address, { ephemeral_message_parameters: { period: 60 } });
```

### Editing Ephemeral Messages

```js
// Edit text of an ephemeral message
bot.editEphemeralMessageText(chatId, ephemeralMessageId, 'Updated text!');

// Edit media
bot.editEphemeralMessageMedia(chatId, ephemeralMessageId, {
  type: 'photo',
  media: '/path/to/new-photo.jpg'
});

// Edit caption
bot.editEphemeralMessageCaption(chatId, ephemeralMessageId, {
  caption: 'New caption',
  parse_mode: 'HTML'
});

// Edit reply markup
bot.editEphemeralMessageReplyMarkup(chatId, ephemeralMessageId, {
  reply_markup: {
    inline_keyboard: [[{ text: 'New Button', callback_data: 'new' }]]
  }
});
```

### Deleting Ephemeral Messages

```js
// Explicitly delete an ephemeral message
bot.deleteEphemeralMessage(chatId, ephemeralMessageId);
```

### Type Definition

```ts
interface EphemeralMessageParameters {
  period: Integer;        // Time in seconds before auto-deletion
  is_persistent?: boolean; // If true, survives bot restarts
}
```

### Events & Message Fields

```js
// The original message contains the ephemeral message ID
bot.on('message', (msg) => {
  if (msg.ephemeral_message_id) {
    console.log('Ephemeral msg ID:', msg.ephemeral_message_id);
    console.log('Ephemeral period:', msg.ephemeral_period);
    console.log('Inner message:', msg.ephemeral_message);
  }
});

// Receiver user (who the ephemeral message is for)
bot.on('message', (msg) => {
  if (msg.receiver_user) {
    console.log('Receiver:', msg.receiver_user.id);
  }
});
```

| Field | Type | Description |
|-------|------|-------------|
| `ephemeral_message` | `Message` | The ephemeral message object |
| `ephemeral_message_id` | `string` | ID to use for edit/delete |
| `ephemeral_period` | `Integer` | Auto-delete period in seconds |
| `receiver_user` | `User` | The user who receives this message |

---

## Guest Mode (Bot API 10.0+)

Guest mode allows bots to interact with users who haven't started a conversation with the bot yet — typically in Web Apps or channel contexts.

### How It Works

1. A guest query arrives as a `guest_message` update
2. The bot processes the query and responds via `answerGuestQuery`
3. The user sees the response in the Web App or channel context

### Methods

```js
// Answer a guest query
bot.answerGuestQuery(guestQueryId, 'Here is the information you requested!', {
  parse_mode: 'HTML'
});
```

### Events

```js
// Listen for guest messages
bot.on('guest_message', (msg) => {
  console.log('Guest query from:', msg.chat.id);
  console.log('Query text:', msg.text);
  console.log('Query ID:', msg.guest_query_id);

  // Respond to the guest
  bot.answerGuestQuery(msg.guest_query_id, 'Thanks for your question!');
});

// Guest caller info on regular messages
bot.on('message', (msg) => {
  if (msg.guest_bot_caller_user) {
    console.log('Guest caller (user):', msg.guest_bot_caller_user.id);
  }
  if (msg.guest_bot_caller_chat) {
    console.log('Guest caller (chat):', msg.guest_bot_caller_chat.id);
  }
});
```

### Types

```ts
interface GuestMessage {
  chat: Chat;
  guest_query_id: string;
  text: string;
}
```

### Message Fields

| Field | Type | Description |
|-------|------|-------------|
| `guest_bot_caller_user` | `User` | User who triggered the guest query |
| `guest_bot_caller_chat` | `Chat` | Chat context of the guest query |
| `guest_query_id` | `string` | ID to pass to `answerGuestQuery` |

---

## Business Accounts (Bot API 9.0+)

Comprehensive APIs for managing business accounts connected to your bot — including messaging, profile management, gifts, stories, and Star currency.

### Message Management

```js
// Mark a business message as read
bot.readBusinessMessage(businessConnectionId, messageId);

// Delete business messages
bot.deleteBusinessMessages(businessConnectionId, [msgId1, msgId2, msgId3]);
```

### Profile Management

```js
// Change business account name
bot.setBusinessAccountName(businessConnectionId, {
  first_name: 'New',
  last_name: 'Name'
});

// Change username
bot.setBusinessAccountUsername(businessConnectionId, {
  username: 'new_username'
});

// Change bio
bot.setBusinessAccountBio(businessConnectionId, {
  bio: 'We provide excellent service!'
});

// Set profile photo
bot.setBusinessAccountProfilePhoto(businessConnectionId, {
  type: 'static',
  photo: '/path/to/photo.jpg'
});

// Remove profile photo
bot.removeBusinessAccountProfilePhoto(businessConnectionId);

// Configure gift settings
bot.setBusinessAccountGiftSettings(businessConnectionId, {
  accepted_gift_types: {
    unlimited_gifts: true,
    limited_gifts: true,
    unique_gifts: false,
    premium_subscription: true
  }
});
```

### Star Balance & Transfers

```js
// Get the business account's Star balance
const balance = await bot.getBusinessAccountStarBalance(businessConnectionId);
console.log('Stars:', balance.star_amount);
console.log('Nanostars:', balance.nanostar_amount);

// Transfer Stars to bot owner
const newBalance = await bot.transferBusinessAccountStars(businessConnectionId, 500);
```

### Gift Management

```js
// Get gifts received by the business account
const gifts = await bot.getBusinessAccountGifts(businessConnectionId);
gifts.forEach(gift => {
  console.log('Gift:', gift.gift?.id, 'From:', gift.sender_user?.first_name);
});

// Convert a gift to Stars
const starAmount = await bot.convertGiftToStars(businessConnectionId, ownedGiftId);

// Upgrade a gift (regular -> unique, or unique -> upgraded collectible)
const upgraded = await bot.upgradeGift(businessConnectionId, ownedGiftId);

// Transfer a gift to another user
await bot.transferGift(businessConnectionId, ownedGiftId, newOwnerChatId);
```

### Stories

```js
// Post a story (photo)
const story = await bot.postStory(businessConnectionId, {
  type: 'photo',
  photo: '/path/to/story-photo.jpg'
}, {
  caption: 'Check out our new product!',
  parse_mode: 'HTML',
  areas: [{
    position: { x_percentage: 0.5, y_percentage: 0.5 },
    type: { type: 'link', url: 'https://example.com' }
  }]
});

// Post a story (video)
const story = await bot.postStory(businessConnectionId, {
  type: 'video',
  video: '/path/to/story-video.mp4',
  duration: 15.0,
  cover_frame_timestamp: 5.0
});

// Edit a story
await bot.editStory(businessConnectionId, storyId, {
  content: {
    type: 'photo',
    photo: '/path/to/updated-photo.jpg'
  },
  caption: 'Updated caption'
});

// Delete a story
await bot.deleteStory(businessConnectionId, storyId);

// Repost a story to other business connections
await bot.repostStory(businessConnectionId, storyId, [targetConnectionId1, targetConnectionId2]);
```

### Premium & Emoji Status

```js
// Gift a Premium subscription
await bot.giftPremiumSubscription(userId, 6, 1000); // 6 months, 1000 Stars

// Set a user's emoji status
await bot.setUserEmojiStatus(userId, {
  custom_emoji_id: '5368324170671202286'
});
```

### Key Types

```ts
interface BusinessBotRights {
  can_reply: boolean;
  can_read_messages?: boolean;
  can_delete_messages?: boolean;
  can_edit_name?: boolean;
  can_edit_username?: boolean;
  can_edit_bio?: boolean;
  can_edit_profile_photo?: boolean;
  can_edit_gift_settings?: boolean;
  can_view_gifts_and_stars?: boolean;
  can_convert_gifts_to_stars?: boolean;
  can_upgraded_gifts?: boolean;
  can_transfer_stars?: boolean;
  can_transfer_gifts?: boolean;
  can_post_stories?: boolean;
  can_edit_stories?: boolean;
  can_delete_stories?: boolean;
  can_manage_stories?: boolean;
}

interface StarAmount {
  star_amount: Integer;
  nanostar_amount?: Integer;
}
```

---

## Gifts & Stars (Bot API 8.0+)

Telegram Stars are the in-platform currency for digital purchases. Gifts are virtual items users can send to each other.

### Getting Available Gifts

```js
// Get the list of gifts the bot can send
const gifts = await bot.getAvailableGifts();
gifts.gifts.forEach(gift => {
  console.log(`Gift: ${gift.id}, Stars: ${gift.star_count}, Premium: ${gift.is_premium}`);
});
```

### Sending Gifts

```js
// Send a gift to a user
await bot.sendGift(userId, giftId, {
  text: 'Happy birthday!',
  parse_mode: 'HTML'
});

// Send a gift to a chat/channel
await bot.sendGift(chatId, giftId);
```

### Star Payments

```js
// Currency code for Stars is "XTR"
bot.sendInvoice(chatId, 'Premium Feature', 'Unlock advanced features', 'payload123', '', 'XTR', [
  { label: '1 Month', amount: 100 },
  { label: '3 Months', amount: 250 }
]);

// Refund a Star payment
await bot.refundStarPayment(userId, telegramPaymentChargeId);

// Get Star transaction history
const transactions = await bot.getStarTransactions({
  offset: 0,
  limit: 100
});
transactions.star_transactions.forEach(tx => {
  console.log(`Transaction: ${tx.amount} Stars, Date: ${tx.date}`);
});

// Edit (cancel) a user's Star subscription
await bot.editUserStarSubscription(userId, telegramPaymentChargeId, true);

// Get the bot's own Star balance
const balance = await bot.getMyStarBalance();
console.log('Bot Stars:', balance.star_amount);
```

### Events

```js
// Gift received
bot.on('gift', (ownedGift) => {
  console.log('Gift received:', ownedGift.gift?.id);
  console.log('From:', ownedGift.sender_user?.first_name);
  console.log('Date:', ownedGift.send_date);
});

// Gift not added (e.g., user declined)
bot.on('gift_non_added', (ownedGift) => {
  console.log('Gift not added:', ownedGift.gift?.id);
});

// Gift upgrade sent
bot.on('gift_upgrade_sent', (msg) => {
  console.log('Gift upgraded!');
});

// Successful payment with Stars
bot.on('successful_payment', (msg) => {
  if (msg.successful_payment?.currency === 'XTR') {
    console.log('Star payment received:', msg.successful_payment.total_amount);
  }
});
```

### Key Types

```ts
interface Gift {
  id: string;
  sticker: Sticker;
  star_count: Integer;
  upgrade_star_count?: number;
  is_premium?: boolean;
  has_colors?: boolean;
  background?: GiftBackground;
  unique_gift_variant_count?: number;
}

interface UniqueGift {
  name: string;
  number: Integer;
  model: UniqueGiftModel;
  pattern: UniqueGiftPattern;
  backdrop: UniqueGiftBackdrop;
  is_from_blockchain?: boolean;
  is_burned?: boolean;
}

interface OwnedGiftRegular {
  gift: Gift;
  owned_gift_id: string;
  sender_user?: User;
  send_date: Integer;
  is_birthday?: boolean;
  can_be_transferred?: boolean;
  transfer_star_count?: Integer;
}

interface OwnedGiftUnique {
  gift: UniqueGift;
  owned_gift_id: string;
  sender_user?: User;
  send_date: Integer;
  is_upgraded?: boolean;
  can_be_transferred?: boolean;
}
```

---

## Checklists (Bot API 9.1+)

Interactive checklists that users can collaborate on — mark tasks as done, add new tasks, and track progress.

### Sending a Checklist

```js
const tasks = [
  { text: 'Buy groceries' },
  { text: 'Clean the house' },
  { text: 'Walk the dog' },
  { text: 'Read a book' }
];

const msg = await bot.sendChecklist(businessConnectionId, 'Weekend Tasks', tasks, {
  others_can_add_tasks: true,
  others_can_mark_tasks_as_done: true
});
```

### Editing a Checklist

```js
// Update tasks (mark some as done, add new ones)
await bot.editMessageChecklist(businessConnectionId, msg.message_id, {
  tasks: [
    { id: 1, text: 'Buy groceries' },       // Existing task
    { id: 2, text: 'Clean the house' },      // Existing task
    { id: 3, text: 'Walk the dog' },         // Existing task
    { id: 4, text: 'Read a book' },          // Existing task
    { text: 'Call mom' }                      // New task (no id)
  ]
});
```

### Events

```js
// Tasks marked as done
bot.on('checklist_tasks_done', (msg) => {
  console.log('Checklist task completed!');
  console.log('Task ID:', msg.reply_to_checklist_task_id);
});

// Tasks added by other users
bot.on('checklist_tasks_added', (msg) => {
  console.log('New tasks added to checklist!');
  console.log('Checklist message ID:', msg.reply_to_checklist_message_id);
});

// Checklist received
bot.on('message', (msg) => {
  if (msg.checklist) {
    console.log('Checklist:', msg.checklist.title);
    msg.checklist.tasks.forEach(task => {
      const status = task.completed_by_user ? 'DONE' : 'TODO';
      console.log(`  [${status}] ${task.text}`);
    });
  }
});
```

### Types

```ts
interface InputChecklistTask {
  id?: Integer;     // Omit for new tasks
  text: string;
  parse_mode?: string;
  text_entities?: MessageEntity[];
}

interface Checklist {
  title: string;
  tasks: ChecklistTask[];
  others_can_add_tasks?: boolean;
  others_can_mark_tasks_as_done?: boolean;
}

interface ChecklistTask {
  id: Integer;
  text: string;
  completed_by_user?: User;
  completed_in_chat_message_id?: Integer;
}
```

---

## Polls (Enhanced)

Polls received major enhancements: media support, multiple correct answers, revoting, user-added options, shuffle, hidden results, and descriptions.

### Media in Polls

```js
// Poll with a photo question
bot.sendPoll(chatId, 'What do you think of this image?', ['Great!', 'Needs work'], {
  media: {
    type: 'photo',
    photo: '/path/to/poll-image.jpg'
  }
});

// Poll with a video
bot.sendPoll(chatId, 'Rate this video', ['Love it', 'It\'s okay', 'Not great'], {
  media: {
    type: 'video',
    video: '/path/to/poll-video.mp4'
  }
});

// Poll with a GIF
bot.sendPoll(chatId, 'Funny GIF?', ['Yes', 'No'], {
  media: {
    type: 'animation',
    animation: '/path/to/funny.gif'
  }
});
```

### Multiple Correct Answers

```js
// Quiz with multiple correct answers
bot.sendPoll(chatId, 'Which are prime numbers?', ['2', '3', '4', '5', '6'], {
  type: 'quiz',
  correct_option_ids: [0, 1, 3],  // 2, 3, and 5 are correct
  explanation: '2, 3, and 5 are prime numbers. 4 = 2×2, 6 = 2×3.'
});
```

### Revoting & User-Added Options

```js
// Allow users to change their vote
bot.sendPoll(chatId, 'Best programming language?', ['JavaScript', 'Python', 'Rust'], {
  allows_revoting: true,
  allow_adding_options: true,  // Users can add new options
  shuffle_options: true,       // Shuffle option order for each user
  hide_results_until_closes: true  // Don't show vote counts until poll closes
});
```

### Poll Descriptions

```js
// Poll with a description
bot.sendPoll(chatId, 'Pick your favorite', ['Option A', 'Option B'], {
  description: 'This poll helps us decide the next feature to build. Your vote matters!',
  description_parse_mode: 'HTML'
});
```

### Media on Poll Options

```ts
// Poll option with media
interface PollOption {
  text: string;
  voter_count: Integer;
  text_entities?: MessageEntity[];
  media?: PollMedia;          // Media attached to this option
  persistent_id?: string;     // For revoting
  added_by_user?: boolean;    // Added by a user
  added_by_chat?: boolean;    // Added by a chat
  addition_date?: number;
}

interface InputPollMedia {
  type?: string;
  text?: string;
  text_entities?: MessageEntity[];
  animation?: string;
  photo?: string;
  sticker?: string;
  video?: string;
  audio?: string;
  voice?: string;
  document?: string;
}
```

### Events

```js
// New poll options added by users
bot.on('poll_option_added', (msg) => {
  console.log('New poll option added!');
});

// Poll option deleted
bot.on('poll_option_deleted', (msg) => {
  console.log('Poll option deleted!');
});
```

---

## Live Photos (Bot API 10.0+)

Live Photos combine a static image with a short video clip, creating an animated photo experience.

### Sending a Live Photo

```js
// Send a live photo (photo + video pair)
bot.sendLivePhoto(chatId, '/path/to/photo.jpg', '/path/to/video.mp4', {
  caption: 'Beautiful sunset!',
  parse_mode: 'HTML',
  disable_notification: false,
  protect_content: true
});

// Live photo from file IDs
bot.sendLivePhoto(chatId, photoFileId, videoFileId);

// Live photo from URLs
bot.sendLivePhoto(chatId, 'https://example.com/photo.jpg', 'https://example.com/video.mp4');
```

### Type Definition

```ts
interface LivePhoto {
  static: PhotoSize;   // The static image
  video: Video;        // The video clip
}
```

### Message Field

```js
bot.on('message', (msg) => {
  if (msg.live_photo) {
    console.log('Live photo received!');
    console.log('Static:', msg.live_photo.static.file_id);
    console.log('Video:', msg.live_photo.video.file_id);
  }
});
```

---

## Stories (Bot API 9.0+)

Post, edit, and delete stories on behalf of managed business accounts. Stories support photos, videos, and interactive areas.

### Posting Stories

```js
// Post a photo story
const story = await bot.postStory(businessConnectionId, {
  type: 'photo',
  photo: '/path/to/story.jpg'
}, {
  caption: 'Our new collection is here!',
  parse_mode: 'HTML',
  areas: [
    {
      position: { x_percentage: 0.3, y_percentage: 0.4 },
      type: { type: 'location', location: { latitude: 40.7128, longitude: -74.0060 } }
    },
    {
      position: { x_percentage: 0.7, y_percentage: 0.6 },
      type: { type: 'link', url: 'https://example.com/shop' }
    },
    {
      position: { x_percentage: 0.5, y_percentage: 0.2 },
      type: { type: 'reaction', reaction_type: { type: 'emoji', emoji: '❤️' } }
    }
  ]
});

// Post a video story
const story = await bot.postStory(businessConnectionId, {
  type: 'video',
  video: '/path/to/story-video.mp4',
  duration: 30.0,
  cover_frame_timestamp: 5.0
}, {
  caption: 'Behind the scenes'
});
```

### Editing & Deleting

```js
// Edit a story
await bot.editStory(businessConnectionId, storyId, {
  caption: 'Updated caption!'
});

// Delete a story
await bot.deleteStory(businessConnectionId, storyId);

// Repost a story to other channels
await bot.repostStory(businessConnectionId, storyId, [
  otherBusinessConnectionId1,
  otherBusinessConnectionId2
]);
```

### Story Area Types

```ts
// Location area
{ type: 'location', location: { latitude, longitude } }

// Venue area
{ type: 'venue', venue: { /* Venue object */ } }

// Reaction area (interactive emoji)
{ type: 'reaction', reaction_type: { type: 'emoji', emoji: '👍' } }

// Link area
{ type: 'link', url: 'https://example.com' }

// Suggested reaction area
{ type: 'suggested_reaction', reaction_type: { type: 'emoji', emoji: '❤️' }, is_dark: true }
```

### Input Types

```ts
type InputStoryContent = InputStoryContentPhoto | InputStoryContentVideo;

interface InputStoryContentPhoto {
  type: 'photo';
  photo: InputFile;
}

interface InputStoryContentVideo {
  type: 'video';
  video: InputFile;
  duration: Float;
  cover_frame_timestamp?: Float;
}

interface InputStoryArea {
  position: StoryAreaPosition;
  type: InputStoryAreaType;
}

interface StoryAreaPosition {
  x_percentage: Float;
  y_percentage: Float;
}
```

---

## Communities (Bot API 10.2+)

Communities group multiple chats together under one umbrella, enabling cross-chat management and coordination.

### Community Type

```ts
interface Community {
  id: Integer;
  name: string;
  description?: string;
}
```

### Getting Community Info

```js
// Community info is available in ChatFullInfo
const chat = await bot.getChat(chatId);
if (chat.community) {
  console.log('Community:', chat.community.name);
  console.log('ID:', chat.community.id);
  console.log('Description:', chat.community.description);
}
```

### Events

```js
// A chat was added to the community
bot.on('community_chat_added', (msg) => {
  console.log('Chat added to community!');
  // Handle the new chat being part of the community
});

// A chat was removed from the community
bot.on('community_chat_removed', (msg) => {
  console.log('Chat removed from community!');
  // Handle the chat leaving the community
});

// A chat joined the community (Bot API 10.3)
bot.on('community_chat_joined', (msg) => {
  console.log('Chat joined community!');
});
```

---

## Suggested Posts (Bot API 9.2+)

Channels can accept suggested posts from users or bots, with optional scheduling and paid posting support.

### Approving & Declining

```js
// Approve a suggested post
await bot.approveSuggestedPost(businessConnectionId, messageId);

// Decline a suggested post
await bot.declineSuggestedPost(businessConnectionId, messageId);
```

### Sending with Suggested Post Parameters

```js
// Create a message with suggested post parameters
bot.sendMessage(chatId, 'Great article about AI!', {
  business_connection_id: businessConnectionId,
  direct_messages_topic_id: topicId,
  suggested_post_parameters: {
    post_type: 'article',
    price: {
      currency: 'XTR',
      amount: 50
    },
    schedule_date: Math.floor(Date.now() / 1000) + 3600  // Schedule for 1 hour from now
  }
});
```

### Direct Messages in Channels

```js
// Send a direct message to a channel topic
bot.sendMessage(chatId, 'Hello in this topic!', {
  direct_messages_topic_id: 12345
});

// Listen for direct messages in topics
bot.on('message', (msg) => {
  if (msg.direct_messages_topic) {
    console.log('DM topic:', msg.direct_messages_topic.message_thread_id);
  }
});
```

### Events

```js
// Suggested post info received
bot.on('suggested_post_info', (msg) => {
  console.log('Suggested post received');
  console.log('Schedule:', msg.suggested_post_info?.schedule_date);
  console.log('Price:', msg.suggested_post_info?.price);
});

// Suggested post approved
bot.on('suggested_post_approved', (msg) => {
  console.log('Post approved!');
});

// Suggested post declined
bot.on('suggested_post_declined', (msg) => {
  console.log('Post declined.');
});

// Suggested post paid
bot.on('suggested_post_paid', (msg) => {
  console.log('Post paid for!');
});

// Suggested post refunded
bot.on('suggested_post_refunded', (msg) => {
  console.log('Post payment refunded.');
});

// Suggested post approval failed
bot.on('suggested_post_approval_failed', (msg) => {
  console.log('Post approval failed.');
});

// Direct messages topic created
bot.on('direct_messages_topic', (msg) => {
  console.log('New DM topic:', msg.direct_messages_topic?.message_thread_id);
});
```

### Types

```ts
interface SuggestedPostParameters {
  post_type?: string;
  price?: SuggestedPostPrice;
  schedule_date?: number;
}

interface SuggestedPostPrice {
  currency: string;
  amount: number;
}

interface DirectMessagesTopic {
  message_thread_id: number;
}
```

---

## Managed Bots (Bot API 9.6+)

Manage bot tokens for bots you control — rotate tokens, save prepared keyboard buttons, and handle managed bot updates.

### Token Management

```js
// Get the current token for a managed bot
const tokenInfo = await bot.getManagedBotToken(botId);
console.log('Bot:', tokenInfo.bot.first_name);
console.log('Token:', tokenInfo.token);
console.log('Last used:', tokenInfo.last_used);

// Replace the token (rotate for security)
const newToken = await bot.replaceManagedBotToken(botId);
console.log('New token:', newToken.token);
```

### Prepared Keyboard Buttons

```js
// Save a keyboard button for later reuse
const prepared = await bot.savePreparedKeyboardButton({
  text: 'Open Store',
  web_app: { url: 'https://example.com/store' }
});

console.log('Button ID:', prepared.button_id);
// Use prepared.button_id later in keyboard arrays
```

### Access Settings

```js
// Get access settings for managed bots
const settings = await bot.getManagedBotAccessSettings();
console.log('Has message access:', settings.has_access_to_messages);
console.log('Restricted channels:', settings.restricted_channels);

// Update access settings
await bot.setManagedBotAccessSettings({
  has_access_to_messages: true,
  restricted_channels: [channelId1, channelId2]
});
```

### Events

```js
// A new managed bot was created
bot.on('managed_bot_created', (msg) => {
  console.log('New managed bot created!');
});

// Managed bot update received
bot.on('managed_bot', (tokenInfo) => {
  console.log('Managed bot updated:', tokenInfo.bot.first_name);
  console.log('Token:', tokenInfo.token);
});
```

### Types

```ts
interface ManagedBotToken {
  bot: User;
  token: string;
  last_used?: Integer;
}

interface ManagedBotAccessSettings {
  has_access_to_messages?: boolean;
  restricted_channels?: Chat[];
}

interface PreparedKeyboardButton {
  button_id: string;
  button: KeyboardButton;
}
```

---

## Chat Subscriptions (Bot API 7.9+)

Create paid subscription invite links for channel chats — users pay Stars to access premium channel content.

### Creating Subscription Links

```js
// Create a subscription invite link
const link = await bot.createChatSubscriptionInviteLink(chatId, {
  name: 'Monthly Premium',
  subscription_period: 2592000,  // 30 days in seconds
  subscription_price: 100         // 100 Stars
});

console.log('Invite link:', link.invite_link);
console.log('Subscription period:', link.subscription_period, 'seconds');
console.log('Price:', link.subscription_price, 'Stars');
```

### Editing Subscription Links

```js
// Edit an existing subscription link
const updated = await bot.editChatSubscriptionInviteLink(chatId, link.invite_link, {
  name: 'Annual Premium',
  subscription_period: 31536000,  // 365 days
  subscription_price: 1000        // 1000 Stars
});
```

### Type

```ts
interface ChatSubscription {
  subscription_id: Integer;
  subscription_period: Integer;  // Duration in seconds
  subscription_price: Integer;   // Price in Stars
  invite_link: string;
}
```

---

## Verification (Bot API 8.2+)

Verify users and chats that your bot manages, adding a verification badge.

### Methods

```js
// Verify a user
await bot.verifyUser(userId, {
  custom_description: 'Official business account'
});

// Verify a chat
await bot.verifyChat(chatId, {
  custom_description: 'Verified community'
});

// Remove user verification
await bot.removeUserVerification(userId);

// Remove chat verification
await bot.removeChatVerification(chatId);
```

### Events

```js
// Verification status updates
bot.on('verified_checks', (update) => {
  update.checks.forEach(check => {
    console.log(`Verification ${check.status}: ${check.source} at ${check.date}`);
  });
});
```

### Type

```ts
interface VerifiedCheck {
  date: Integer;
  status: string;   // 'verified', 'unverified', etc.
  source: string;
}

interface VerifiedChecks {
  checks: VerifiedCheck[];
}
```

---

## Reactions (Bot API 10.0+)

Manage reactions on messages — set, delete individual reactions, or clear all reactions.

### Setting Reactions

```js
// Set reactions on a message
await bot.setMessageReaction(chatId, messageId, {
  reaction: [
    { type: 'emoji', emoji: '👍' },
    { type: 'emoji', emoji: '❤️' }
  ],
  is_big: true  // Show enlarged reaction animation
});

// Set a custom emoji reaction
await bot.setMessageReaction(chatId, messageId, {
  reaction: [
    { type: 'custom_emoji', custom_emoji_id: '5368324170671202286' }
  ]
});

// Set a paid reaction
await bot.setMessageReaction(chatId, messageId, {
  reaction: [{ type: 'paid' }]
});
```

### Deleting Reactions

```js
// Delete all reactions from a message
await bot.deleteAllMessageReactions(chatId, messageId);

// Delete a specific reaction
await bot.deleteMessageReaction(chatId, messageId, {
  reaction_type: { type: 'emoji', emoji: '👍' }
});

// Delete a custom emoji reaction
await bot.deleteMessageReaction(chatId, messageId, {
  reaction_type: { type: 'custom_emoji', custom_emoji_id: '5368324170671202286' }
});
```

### Events

```js
// Individual reaction changes
bot.on('message_reaction', (update) => {
  console.log('Chat:', update.chat.id);
  console.log('Message:', update.message_id);
  console.log('Old reactions:', update.old_reaction);
  console.log('New reactions:', update.new_reaction);
  console.log('Actor:', update.user?.first_name || update.actor_chat?.id);
});

// Reaction count updates (anonymous polls)
bot.on('message_reaction_count', (update) => {
  update.reactions.forEach(reaction => {
    console.log(`${reaction.type.emoji || reaction.type}: ${reaction.total_count}`);
  });
});
```

---

## Keyboard Enhancements (Bot API 9.4–10.3)

Buttons now support visual styling, custom emoji icons, disabled state, and force reply on keyboards.

### Button Styles (Colors)

```js
// Styled inline keyboard buttons
const keyboard = {
  inline_keyboard: [
    [
      { text: 'Primary', callback_data: 'primary', style: 'primary' },
      { text: 'Secondary', callback_data: 'secondary', style: 'secondary' }
    ],
    [
      { text: 'Danger', callback_data: 'danger', style: 'danger' }
    ]
  ]
};

bot.sendMessage(chatId, 'Choose an action:', { reply_markup: keyboard });

// Reply keyboard buttons with styles
const replyKeyboard = {
  keyboard: [
    [
      { text: '🟢 Start', style: 'primary' },
      { text: '🔴 Stop', style: 'danger' }
    ],
    [
      { text: '⚙️ Settings', style: 'secondary' }
    ]
  ],
  resize_keyboard: true
};

bot.sendMessage(chatId, 'Select:', { reply_markup: replyKeyboard });
```

### Custom Emoji on Buttons

```js
// Inline button with emoji icon
const keyboard = {
  inline_keyboard: [[
    {
      text: 'Like this post',
      callback_data: 'like',
      icon_custom_emoji_id: '5368324170671202286'  // Heart emoji
    }
  ]]
};

// Reply keyboard button with emoji
const replyKeyboard = {
  keyboard: [[
    {
      text: 'Open Menu',
      icon_custom_emoji_id: '5368324170671202286'
    }
  ]]
};
```

### Disabled Buttons

```js
// Render a button as grayed out / non-clickable
const keyboard = {
  inline_keyboard: [
    [
      { text: 'Available', callback_data: 'available' },
      { text: 'Unavailable', callback_data: 'none', disabled: {} }
    ]
  ]
};
```

### Force Reply on Keyboards

```js
// Force reply on inline keyboard
const inlineKb = {
  inline_keyboard: [[{ text: 'Reply', callback_data: 'reply' }]],
  force_reply: true
};

// Force reply on reply keyboard
const replyKb = {
  keyboard: [[{ text: 'Tap to reply' }]],
  force_reply: true,
  resize_keyboard: true
};

bot.sendMessage(chatId, 'Please reply:', { reply_markup: replyKb });
```

---

## Direct Messages in Channels (Bot API 9.2+)

Channels can now have direct message topics where users can send private messages to channel administrators.

### Sending to Direct Message Topics

```js
// Send a message to a specific DM topic in a channel
bot.sendMessage(chatId, 'Thanks for reaching out!', {
  direct_messages_topic_id: topicId
});

// Forward messages to DM topics
bot.forwardMessage(chatId, fromChatId, messageId, {
  direct_messages_topic_id: topicId
});

// Copy messages to DM topics
bot.copyMessage(chatId, fromChatId, messageId, {
  direct_messages_topic_id: topicId
});
```

### Available on All Send Methods

The `direct_messages_topic_id` parameter is available on:
- `sendMessage`, `sendPhoto`, `sendAudio`, `sendDocument`, `sendVideo`
- `sendAnimation`, `sendVoice`, `sendVideoNote`, `sendSticker`
- `sendLocation`, `sendVenue`, `sendContact`, `sendPoll`, `sendDice`
- `sendGame`, `sendInvoice`, `sendPaidMedia`, `sendMediaGroup`
- `forwardMessage`, `forwardMessages`, `copyMessage`, `copyMessages`

### Type

```ts
interface DirectMessagesTopic {
  message_thread_id: number;
}
```

---

## Profile Management (Bot API 9.4–9.5)

Manage your bot's profile photo, retrieve user profile audio files, and set member tags.

### Bot Profile Photo

```js
// Set the bot's profile photo
await bot.setMyProfilePhoto({
  type: 'static',
  photo: '/path/to/bot-photo.jpg'
});

// Animated profile photo
await bot.setMyProfilePhoto({
  type: 'animated',
  animation: '/path/to/bot-animation.mp4',
  main_frame_timestamp: 0.5
});

// Video profile photo
await bot.setMyProfilePhoto({
  type: 'video',
  animation: '/path/to/bot-video.mp4',
  main_frame_timestamp: 1.0
});

// Remove the bot's profile photo
await bot.removeMyProfilePhoto();
```

### User Profile Audio

```js
// Get audio files from a user's profile
const audios = await bot.getUserProfileAudios(userId);
audios.forEach(audio => {
  console.log(`Audio: ${audio.file_id}, Duration: ${audio.duration}s`);
});
```

### Chat Member Tags

```js
// Set a tag for a user in a group chat
await bot.setChatMemberTag(chatId, userId, {
  tag: 'VIP'
});

// The tag is visible in the member list
bot.on('message', (msg) => {
  if (msg.sender_tag) {
    console.log('Sender tag:', msg.sender_tag);
  }
});
```

### Type

```ts
type InputProfilePhoto =
  | InputProfilePhotoStatic
  | InputProfilePhotoAnimated
  | InputProfilePhotoVideo;

interface InputProfilePhotoStatic {
  type: 'static';
  photo: InputFile;
}

interface InputProfilePhotoAnimated {
  type: 'animated';
  animation: InputFile;
  main_frame_timestamp?: Float;
}

interface InputProfilePhotoVideo {
  type: 'video';
  animation: InputFile;
  main_frame_timestamp?: Float;
}
```

---

## Paid Broadcast (Bot API 7.11+)

Send messages to large channels as paid broadcasts — the channel owner receives Stars for allowing the broadcast.

### Usage

```js
// Send a paid broadcast message
bot.sendMessage(channelId, 'Sponsored content from our partners!', {
  allow_paid_broadcast: true
});

// Works with all message types
bot.sendPhoto(channelId, '/path/to/ad.jpg', {
  caption: 'Sponsored: Check out this product!',
  allow_paid_broadcast: true
});

bot.sendVideo(channelId, '/path/to/ad.mp4', {
  caption: 'Sponsored video',
  allow_paid_broadcast: true
});

bot.sendDocument(channelId, '/path/to/brochure.pdf', {
  allow_paid_broadcast: true
});

bot.sendAnimation(channelId, '/path/to/animation.gif', {
  allow_paid_broadcast: true
});
```

### Available On

The `allow_paid_broadcast` parameter is available on all send methods.

---

## Join Request Queries (Bot API 10.1+)

Enhanced join request handling — bots can now respond to join requests with interactive queries and Web App responses.

### Methods

```js
// Answer a join request query
bot.on('chat_join_request', async (request) => {
  // User has a query_id — answer it
  if (request.query_id) {
    await bot.answerChatJoinRequestQuery(request.chat.id, request.query_id, {
      text: 'Welcome! Please answer a few questions.',
      parse_mode: 'HTML'
    });
  }

  // Or send a Web App response
  if (request.query_id) {
    await bot.sendChatJoinRequestWebApp(request.chat.id, {
      inline_message_id: 'prepared_inline_message_id'
    });
  }

  // Traditional approve/decline still works
  await bot.approveChatJoinRequest(request.chat.id, request.from.id);
});
```

### Types

```ts
// ChatJoinRequest now includes query_id
interface ChatJoinRequest {
  chat: Chat;
  from: User;
  user_chat_id: Integer;
  date: Integer;
  bio?: string;
  invite_link?: ChatInviteLink;
  query_id?: number;    // NEW: for answerChatJoinRequestQuery
}
```

---

## Quick Reference: Events by Version

| Version | New Events |
|---------|-----------|
| **7.4** | `refunded_payment` |
| **8.0** | `gift`, `unique_gift`, `paid_message_price_changed`, `paid_star_count` |
| **8.3** | `giveaway_created`, `giveaway`, `giveaway_winners`, `giveaway_completed`, `chat_boost_added`, `story`, `chat_background_set`, `forum_topic_created`, `forum_topic_closed`, `forum_topic_reopened`, `forum_topic_edited`, `general_forum_topic_hidden`, `general_forum_topic_unhidden`, `write_access_allowed`, `boost` |
| **9.0** | `gift`, `unique_gift`, `paid_message_price_changed`, `paid_star_count` |
| **9.1** | `checklist`, `checklist_tasks_done`, `checklist_tasks_added`, `direct_message_price_changed` |
| **9.2** | `direct_messages_topic`, `suggested_post_info`, `suggested_post_approved`, `suggested_post_approval_failed`, `suggested_post_declined`, `suggested_post_paid`, `suggested_post_refunded` |
| **9.3** | `gift_upgrade_sent` |
| **9.4** | `chat_owner_left`, `chat_owner_changed` |
| **9.5** | `sender_tag` |
| **9.6** | `managed_bot_created`, `poll_option_added`, `poll_option_deleted` |
| **10.0** | `guest_bot_caller_user`, `guest_bot_caller_chat`, `guest_query_id`, `live_photo` |
| **10.1** | `rich_message` |
| **10.2** | `ephemeral_message_id`, `receiver_user`, `community_chat_added`, `community_chat_removed` |
| **10.3** | `stopped_message_generation`, `community_chat_joined` |

---

## Quick Reference: New Send Method Parameters

| Parameter | Versions | Description |
|-----------|----------|-------------|
| `ephemeral_message_parameters` | 10.2+ | Auto-delete timer for messages |
| `direct_messages_topic_id` | 9.2+ | Target DM topic in channels |
| `suggested_post_parameters` | 9.2+ | Scheduling and pricing for suggested posts |
| `allow_paid_broadcast` | 7.11+ | Send paid broadcasts to channels |
| `business_connection_id` | 9.0+ | Operate on behalf of a business account |
| `message_effect_id` | 8.3+ | Attach a message effect |

---

## Quick Reference: New Methods by Version

| Version | New Methods |
|---------|------------|
| **7.4** | `refundStarPayment` |
| **7.5** | `getStarTransactions` |
| **7.6** | `sendPaidMedia` |
| **7.9** | `createChatSubscriptionInviteLink`, `editChatSubscriptionInviteLink` |
| **8.0** | `getAvailableGifts`, `sendGift`, `editUserStarSubscription`, `savePreparedInlineMessage` |
| **8.2** | `verifyUser`, `verifyChat`, `removeUserVerification`, `removeChatVerification` |
| **9.0** | `readBusinessMessage`, `deleteBusinessMessages`, `setBusinessAccountName`, `setBusinessAccountUsername`, `setBusinessAccountBio`, `setBusinessAccountProfilePhoto`, `removeBusinessAccountProfilePhoto`, `setBusinessAccountGiftSettings`, `getBusinessAccountStarBalance`, `transferBusinessAccountStars`, `getBusinessAccountGifts`, `convertGiftToStars`, `upgradeGift`, `transferGift`, `postStory`, `editStory`, `deleteStory`, `giftPremiumSubscription`, `setUserEmojiStatus` |
| **9.1** | `sendChecklist`, `editMessageChecklist`, `getMyStarBalance` |
| **9.2** | `approveSuggestedPost`, `declineSuggestedPost` |
| **9.3** | `sendMessageDraft`, `getUserGifts`, `getChatGifts`, `repostStory` |
| **9.4** | `setMyProfilePhoto`, `removeMyProfilePhoto`, `getUserProfileAudios` |
| **9.5** | `setChatMemberTag` |
| **9.6** | `getManagedBotToken`, `replaceManagedBotToken`, `savePreparedKeyboardButton` |
| **10.0** | `answerGuestQuery`, `sendLivePhoto`, `deleteAllMessageReactions`, `deleteMessageReaction`, `getManagedBotAccessSettings`, `setManagedBotAccessSettings`, `getUserPersonalChatMessages` |
| **10.1** | `sendRichMessage`, `sendRichMessageDraft`, `answerChatJoinRequestQuery`, `sendChatJoinRequestWebApp` |
| **10.2** | `editEphemeralMessageText`, `editEphemeralMessageMedia`, `editEphemeralMessageCaption`, `editEphemeralMessageReplyMarkup`, `deleteEphemeralMessage` |
