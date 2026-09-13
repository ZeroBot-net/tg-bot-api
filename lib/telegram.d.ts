// Type definitions for @zero-bot.net/tg-bot-api
// Bot API 7.0 through 10.3

import { EventEmitter } from 'events';
import { Stream } from 'stream';
import { IncomingMessage } from 'http';
import * as https from 'https';

// ============================================================================
// TELEGRAM BOT API TYPES (Bot API 7.0 – 10.3)
// ============================================================================

// ---------------------------------------------------------------------------
// Basic Types
// ---------------------------------------------------------------------------

/** Integer type */
export type Integer = number;

/** Float type */
export type Float = number;

/** This object represents a Telegram user or bot. */
export interface User {
  id: Integer;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  added_to_attachment_menu?: boolean;
  can_join_groups?: boolean;
  can_read_all_group_messages?: boolean;
  supports_inline_queries?: boolean;
  can_connect_to_business?: boolean;
  has_main_web_app?: boolean;
}

/** This object represents info about the user's bot. */
export interface BotInfo {
  username: string;
  first_name: string;
  can_join_groups: boolean;
  can_read_all_group_messages: boolean;
  supports_inline_queries: boolean;
  can_connect_to_business: boolean;
  has_main_web_app: boolean;
}

/** This object represents one special entity in a text message entity. */
export interface MessageEntity {
  type: string;
  offset: Integer;
  length: Integer;
  url?: string;
  user?: User;
  language?: string;
  custom_emoji_id?: string;
}

/** This object represents one size of a photo or a file/sticker thumbnail. */
export interface PhotoSize {
  file_id: string;
  file_unique_id: string;
  width: Integer;
  height: Integer;
  file_size?: Integer;
}

/** This object represents an animation file (GIF or H.264/MPEG-4 AVC video without sound). */
export interface Animation {
  file_id: string;
  file_unique_id: string;
  width: Integer;
  height: Integer;
  duration: Integer;
  thumbnail?: PhotoSize;
  file_name?: string;
  mime_type?: string;
  file_size?: Integer;
}

/** This object represents an audio file. */
export interface Audio {
  file_id: string;
  file_unique_id: string;
  duration: Integer;
  performer?: string;
  title?: string;
  file_name?: string;
  mime_type?: string;
  file_size?: Integer;
  thumbnail?: PhotoSize;
}

/** This object represents a general file (as opposed to photos, voice messages, audio files, etc.). */
export interface Document {
  file_id: string;
  file_unique_id: string;
  thumbnail?: PhotoSize;
  file_name?: string;
  mime_type?: string;
  file_size?: Integer;
}

/** This object represents a video file. */
export interface Video {
  file_id: string;
  file_unique_id: string;
  width: Integer;
  height: Integer;
  duration: Integer;
  thumbnail?: PhotoSize;
  file_name?: string;
  mime_type?: string;
  file_size?: Integer;
}

/** This object represents a video message. */
export interface VideoNote {
  file_id: string;
  file_unique_id: string;
  length: Integer;
  duration: Integer;
  thumbnail?: PhotoSize;
  file_size?: Integer;
}

/** This object represents a voice message. */
export interface Voice {
  file_id: string;
  file_unique_id: string;
  duration: Integer;
  mime_type?: string;
  file_size?: Integer;
}

/** This object represents a phone contact. */
export interface Contact {
  phone_number: string;
  first_name: string;
  last_name?: string;
  user_id?: Integer;
  vcard?: string;
}

/** This object represents an incoming inline query. */
export interface InlineQuery {
  id: string;
  from: User;
  query: string;
  offset: string;
  chat_type?: string;
  location?: Location;
}

/** This object represents one result of an inline query. */
export interface InlineQueryResult {
  type: string;
  id: string;
}

export interface InlineQueryResultArticle extends InlineQueryResult {
  type: 'article';
  title: string;
  input_message_content: InputMessageContent;
  reply_markup?: InlineKeyboardMarkup;
  url?: string;
  hide_url?: boolean;
  description?: string;
  thumb_url?: string;
  thumb_width?: Integer;
  thumb_height?: Integer;
}

export interface InlineQueryResultPhoto extends InlineQueryResult {
  type: 'photo';
  photo_url: string;
  thumbnail_url: string;
  photo_width?: Integer;
  photo_height?: Integer;
  title?: string;
  description?: string;
  caption?: string;
  parse_mode?: string;
  caption_entities?: MessageEntity[];
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
}

export interface InlineQueryResultGif extends InlineQueryResult {
  type: 'gif';
  gif_url: string;
  gif_width?: Integer;
  gif_height?: Integer;
  gif_duration?: Integer;
  thumbnail_url: string;
  title?: string;
  caption?: string;
  parse_mode?: string;
  caption_entities?: MessageEntity[];
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
}

export interface InlineQueryResultMpeg4Gif extends InlineQueryResult {
  type: 'mpeg4_gif';
  mpeg4_url: string;
  mpeg4_width?: Integer;
  mpeg4_height?: Integer;
  mpeg4_duration?: Integer;
  thumbnail_url: string;
  title?: string;
  caption?: string;
  parse_mode?: string;
  caption_entities?: MessageEntity[];
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
}

export interface InlineQueryResultVideo extends InlineQueryResult {
  type: 'video';
  video_url: string;
  mime_type: string;
  thumbnail_url: string;
  title: string;
  caption?: string;
  parse_mode?: string;
  caption_entities?: MessageEntity[];
  video_width?: Integer;
  video_height?: Integer;
  video_duration?: Integer;
  description?: string;
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
}

export interface InlineQueryResultAudio extends InlineQueryResult {
  type: 'audio';
  audio_url: string;
  title: string;
  caption?: string;
  parse_mode?: string;
  caption_entities?: MessageEntity[];
  performer?: string;
  audio_duration?: Integer;
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
}

export interface InlineQueryResultVoice extends InlineQueryResult {
  type: 'voice';
  voice_url: string;
  title: string;
  caption?: string;
  parse_mode?: string;
  caption_entities?: MessageEntity[];
  voice_duration?: Integer;
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
}

export interface InlineQueryResultDocument extends InlineQueryResult {
  type: 'document';
  title: string;
  caption?: string;
  parse_mode?: string;
  caption_entities?: MessageEntity[];
  document_url: string;
  mime_type: string;
  description?: string;
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
  thumbnail_url?: string;
  thumbnail_width?: Integer;
  thumbnail_height?: Integer;
}

export interface InlineQueryResultLocation extends InlineQueryResult {
  type: 'location';
  latitude: Float;
  longitude: Float;
  title: string;
  live_period?: Integer;
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
  thumbnail_url?: string;
  thumbnail_width?: Integer;
  thumbnail_height?: Integer;
}

export interface InlineQueryResultVenue extends InlineQueryResult {
  type: 'venue';
  latitude: Float;
  longitude: Float;
  title: string;
  address: string;
  foursquare_id?: string;
  foursquare_type?: string;
  google_place_id?: string;
  google_place_type?: string;
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
  thumbnail_url?: string;
  thumbnail_width?: Integer;
  thumbnail_height?: Integer;
}

export interface InlineQueryResultContact extends InlineQueryResult {
  type: 'contact';
  phone_number: string;
  first_name: string;
  last_name?: string;
  vcard?: string;
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
  thumbnail_url?: string;
  thumbnail_width?: Integer;
  thumbnail_height?: Integer;
}

export interface InlineQueryResultGame extends InlineQueryResult {
  type: 'game';
  game_short_name: string;
  reply_markup?: InlineKeyboardMarkup;
}

export interface InlineQueryResultCachedPhoto extends InlineQueryResult {
  type: 'photo';
  photo_file_id: string;
  title?: string;
  description?: string;
  caption?: string;
  parse_mode?: string;
  caption_entities?: MessageEntity[];
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
}

export interface InlineQueryResultCachedGif extends InlineQueryResult {
  type: 'gif';
  id: string;
  gif_file_id: string;
  title?: string;
  caption?: string;
  parse_mode?: string;
  caption_entities?: MessageEntity[];
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
}

export interface InlineQueryResultCachedMpeg4Gif extends InlineQueryResult {
  type: 'mpeg4_gif';
  mpeg4_file_id: string;
  title?: string;
  caption?: string;
  parse_mode?: string;
  caption_entities?: MessageEntity[];
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
}

export interface InlineQueryResultCachedSticker extends InlineQueryResult {
  type: 'sticker';
  sticker_file_id: string;
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
}

export interface InlineQueryResultCachedDocument extends InlineQueryResult {
  type: 'document';
  title: string;
  document_file_id: string;
  description?: string;
  caption?: string;
  parse_mode?: string;
  caption_entities?: MessageEntity[];
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
}

export interface InlineQueryResultCachedVideo extends InlineQueryResult {
  type: 'video';
  video_file_id: string;
  title: string;
  description?: string;
  caption?: string;
  parse_mode?: string;
  caption_entities?: MessageEntity[];
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
}

export interface InlineQueryResultCachedVoice extends InlineQueryResult {
  type: 'voice';
  voice_file_id: string;
  title: string;
  caption?: string;
  parse_mode?: string;
  caption_entities?: MessageEntity[];
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
}

export interface InlineQueryResultCachedAudio extends InlineQueryResult {
  type: 'audio';
  audio_file_id: string;
  caption?: string;
  parse_mode?: string;
  caption_entities?: MessageEntity[];
  reply_markup?: InlineKeyboardMarkup;
  input_message_content?: InputMessageContent;
}

/** Describes the content of a message to be sent as a result of an inline query. */
export type InputMessageContent =
  | InputTextMessageContent
  | InputLocationMessageContent
  | InputVenueMessageContent
  | InputContactMessageContent
  | InputInvoiceMessageContent;

export interface InputTextMessageContent {
  message_text: string;
  parse_mode?: string;
  entities?: MessageEntity[];
  link_preview_options?: LinkPreviewOptions;
}

export interface InputLocationMessageContent {
  latitude: Float;
  longitude: Float;
  live_period?: Integer;
  horizontal_accuracy?: Float;
  heading?: Integer;
  proximity_alert_radius?: Integer;
}

export interface InputVenueMessageContent {
  latitude: Float;
  longitude: Float;
  title: string;
  address: string;
  foursquare_id?: string;
  foursquare_type?: string;
  google_place_id?: string;
  google_place_type?: string;
}

export interface InputContactMessageContent {
  phone_number: string;
  first_name: string;
  last_name?: string;
  vcard?: string;
}

export interface InputInvoiceMessageContent {
  title: string;
  description: string;
  payload: string;
  provider_token?: string;
  currency: string;
  prices: LabeledPrice[];
  max_tip_amount?: Integer;
  suggested_tip_amounts?: Integer[];
  provider_data?: string;
  photo_url?: string;
  photo_size?: Integer;
  photo_width?: Integer;
  photo_height?: Integer;
  need_name?: boolean;
  need_phone_number?: boolean;
  need_email?: boolean;
  need_shipping_address?: boolean;
  send_phone_number_to_provider?: boolean;
  send_email_to_provider?: boolean;
  is_flexible?: boolean;
}

/** This object represents one result of an inline query that was chosen by the user and sent to their chat partner. */
export interface ChosenInlineResult {
  result_id: string;
  from: User;
  query: string;
  inline_message_id?: string;
  location?: Location;
}

/** This object represents the content of a successful payment. */
export interface SuccessfulPayment {
  currency: string;
  total_amount: Integer;
  invoice_payload: string;
  shipping_option_id?: string;
  order_info?: OrderInfo;
  telegram_payment_charge_id: string;
  provider_payment_charge_id: string;
}

/** This object contains information about an incoming pre-checkout query. */
export interface PreCheckoutQuery {
  id: string;
  from: User;
  currency: string;
  total_amount: Integer;
  invoice_payload: string;
  shipping_option_id?: string;
  order_info?: OrderInfo;
}

/** This object represents one shipping option. */
export interface ShippingOption {
  id: string;
  title: string;
  prices: LabeledPrice[];
}

/** This object represents a shipping address. */
export interface ShippingAddress {
  country_code: string;
  state: string;
  city: string;
  street_line1: string;
  street_line2: string;
  post_code: string;
}

/** This object represents information about an order. */
export interface OrderInfo {
  name?: string;
  phone_number?: string;
  email?: string;
  shipping_address?: ShippingAddress;
}

/** This object represents a price. */
export interface LabeledPrice {
  label: string;
  amount: Integer;
}

/** This object represents one shipping query. */
export interface ShippingQuery {
  id: string;
  from: User;
  invoice_payload: string;
  shipping_address: ShippingAddress;
}

/** This object represents a poll. */
export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  total_voter_count: Integer;
  is_closed: boolean;
  is_anonymous: boolean;
  type: string;
  allows_multiple_answers: boolean;
  correct_option_id?: Integer;
  explanation?: string;
  explanation_entities?: MessageEntity[];
  open_period?: Integer;
  close_date?: Integer;
}

/** This object represents one answer of a user from a poll. */
export interface PollAnswer {
  poll_id: string;
  voter_chat?: Chat;
  user?: User;
  option_ids: Integer[];
}

/** This object represents an answer of a user in a non-anonymous poll. */
export interface PollOption {
  text: string;
  voter_count: Integer;
}

/** This object contains information about a user that was added to a chat. */
export interface ChatMemberUpdated {
  chat: Chat;
  from: User;
  date: Integer;
  old_chat_member: ChatMember;
  new_chat_member: ChatMember;
  invite_link?: ChatInviteLink;
  via_join_request?: boolean;
  via_chat_folder_invite_link?: boolean;
  via_business_bot?: boolean;
  old_chat_member_is_direct?: boolean;
  new_chat_member_is_direct?: boolean;
}

/** This object represents a chat join request. */
export interface ChatJoinRequest {
  chat: Chat;
  from: User;
  user_chat_id: Integer;
  date: Integer;
  bio?: string;
  invite_link?: ChatInviteLink;
}

/** This object contains information about one member of a chat. */
export type ChatMember =
  | ChatMemberOwner
  | ChatMemberAdministrator
  | ChatMemberMember
  | ChatMemberRestricted
  | ChatMemberLeft
  | ChatMemberBanned;

export interface ChatMemberOwner {
  status: 'creator';
  user: User;
  is_anonymous: boolean;
  custom_title?: string;
}

export interface ChatMemberAdministrator {
  status: 'administrator';
  user: User;
  can_be_edited: boolean;
  can_manage_chat: boolean;
  can_delete_messages: boolean;
  can_manage_video_chats: boolean;
  can_restrict_members: boolean;
  can_promote_members: boolean;
  can_change_info: boolean;
  can_invite_users: boolean;
  can_post_messages?: boolean;
  can_edit_messages?: boolean;
  can_pin_messages?: boolean;
  can_manage_topics?: boolean;
  is_anonymous?: boolean;
  custom_title?: string;
}

export interface ChatMemberMember {
  status: 'member';
  user: User;
  until_date?: Integer;
}

export interface ChatMemberRestricted {
  status: 'restricted';
  user: User;
  is_member: boolean;
  can_send_messages: boolean;
  can_send_audios: boolean;
  can_send_documents: boolean;
  can_send_photos: boolean;
  can_send_videos: boolean;
  can_send_video_notes: boolean;
  can_send_voice_notes: boolean;
  can_send_polls: boolean;
  can_send_other_messages: boolean;
  can_add_web_page_previews: boolean;
  can_change_info: boolean;
  can_invite_users: boolean;
  can_pin_messages: boolean;
  can_manage_topics: boolean;
  until_date: Integer;
}

export interface ChatMemberLeft {
  status: 'left';
  user: User;
}

export interface ChatMemberBanned {
  status: 'kicked';
  user: User;
  until_date: Integer;
}

/** This object represents a chat photo. */
export interface ChatPhoto {
  small_file_id: string;
  small_file_unique_id: string;
  big_file_id: string;
  big_file_unique_id: string;
}

/** This object represents an invite link for a chat. */
export interface ChatInviteLink {
  invite_link: string;
  creator: User;
  creates_join_request: boolean;
  is_primary: boolean;
  is_revoked: boolean;
  name?: string;
  expire_date?: Integer;
  member_limit?: Integer;
  pending_join_request_count?: Integer;
  subscription_period?: Integer;
  subscription_price?: Integer;
}

/** This object contains information about a chat boost. */
export interface ChatBoost {
  boost_id: string;
  add_date: Integer;
  expiration_date: Integer;
  source: ChatBoostSource;
}

/** Describes the source of a chat boost. */
export type ChatBoostSource = ChatBoostSourcePremium | ChatBoostSourceGiftCode | ChatBoostSourceGiveaway;

export interface ChatBoostSourcePremium {
  source: 'premium';
  user: User;
}

export interface ChatBoostSourceGiftCode {
  source: 'gift_code';
}

export interface ChatBoostSourceGiveaway {
  source: 'giveaway';
  giveaway_message_id: Integer;
  user?: User;
  is_unclaimed?: boolean;
}

/** This object describes a chat's membership in a chat subscription. */
export interface ChatSubscription {
  subscription_id: Integer;
  subscription_period: Integer;
  subscription_price: Integer;
  invite_link: string;
}

/** Represents the rights of an administrator in a chat. */
export interface ChatAdministratorRights {
  is_anonymous: boolean;
  can_manage_chat: boolean;
  can_delete_messages: boolean;
  can_manage_video_chats: boolean;
  can_restrict_members: boolean;
  can_promote_members: boolean;
  can_change_info: boolean;
  can_invite_users: boolean;
  can_post_messages?: boolean;
  can_edit_messages?: boolean;
  can_pin_messages?: boolean;
  can_manage_topics?: boolean;
  can_post_stories?: boolean;
  can_edit_stories?: boolean;
  can_delete_stories?: boolean;
  can_manage_direct_messages?: boolean;
}

/** This object represents the permissions of a default chat administrator in a chat. */
export interface ChatPermissions {
  can_send_messages?: boolean;
  can_send_audios?: boolean;
  can_send_documents?: boolean;
  can_send_photos?: boolean;
  can_send_videos?: boolean;
  can_send_video_notes?: boolean;
  can_send_voice_notes?: boolean;
  can_send_polls?: boolean;
  can_send_other_messages?: boolean;
  can_add_web_page_previews?: boolean;
  can_change_info?: boolean;
  can_invite_users?: boolean;
  can_pin_messages?: boolean;
  can_manage_topics?: boolean;
  can_change_gift_settings?: boolean;
}

/** This object represents a forum topic. */
export interface ForumTopic {
  message_thread_id: Integer;
  name: string;
  icon_color: Integer;
  icon_custom_emoji_id?: string;
}

/** This object describes a bot's menu button in a private chat. */
export type MenuButton = MenuButtonCommands | MenuButtonWebApp | MenuButtonDefault;

export interface MenuButtonCommands {
  type: 'commands';
}

export interface MenuButtonWebApp {
  type: 'web_app';
  text: string;
  web_app: WebAppInfo;
}

export interface MenuButtonDefault {
  type: 'default';
}

/** This object represents a file ready to be downloaded. */
export interface File {
  file_id: string;
  file_unique_id: string;
  file_size?: Integer;
  file_path?: string;
}

/** This object represents a user's profile pictures. */
export interface UserProfilePhotos {
  total_count: Integer;
  photos: PhotoSize[][];
}

/** This object represents an area on a map. */
export interface Location {
  longitude: Float;
  latitude: Float;
  horizontal_accuracy?: Float;
  live_period?: Integer;
  heading?: Integer;
  proximity_alert_radius?: Integer;
}

/** This object represents a venue. */
export interface Venue {
  location: Location;
  title: string;
  address: string;
  foursquare_id?: string;
  foursquare_type?: string;
  google_place_id?: string;
  google_place_type?: string;
}

/** Describes data sent from a Web App to the bot. */
export interface WebAppData {
  data: string;
  button_text: string;
}

/** Describes a Web App. */
export interface WebAppInfo {
  url: string;
}

/** This object describes the origin of a story. */
export interface StoryOrigin {
  type: string;
}

export interface StoryOriginMessageForwardedFromChannel extends StoryOrigin {
  type: 'message_forwarded_from_channel';
  chat: Chat;
  message_id: Integer;
}

export interface StoryOriginMessageEditedPost extends StoryOrigin {
  type: 'message_edited_post';
  chat: Chat;
  message_id: Integer;
}

/** This object describes the source of a story. */
export interface Story {
  id: Integer;
  from: User;
  owner_chat?: Chat;
  caption?: string;
  entities?: MessageEntity[];
}

/** Represents the rights of a story poster. */
export interface StoryAreaPosition {
  x_percentage: Float;
  y_percentage: Float;
}

/** This object describes a story area. */
export type StoryAreaType =
  | StoryAreaTypeLocation
  | StoryAreaTypeVenue
  | StoryAreaTypeReaction
  | StoryAreaTypeLink
  | StoryAreaTypeSuggestedReaction;

export interface StoryAreaTypeLocation {
  type: 'location';
  location: Location;
}

export interface StoryAreaTypeVenue {
  type: 'venue';
  venue: Venue;
}

export interface StoryAreaTypeReaction {
  type: 'reaction';
  reaction_type: ReactionType;
}

export interface StoryAreaTypeLink {
  type: 'link';
  url: string;
}

export interface StoryAreaTypeSuggestedReaction {
  type: 'suggested_reaction';
  reaction_type: ReactionType;
  is_dark?: boolean;
  is_flipped?: boolean;
}

export interface StoryArea {
  position: StoryAreaPosition;
  type: StoryAreaType;
}

/** This object describes the paid media content to be sent. */
export interface PaidMediaInfo {
  star_count: Integer;
  media: PaidMedia[];
  caption?: string;
  parse_mode?: string;
  caption_entities?: MessageEntity[];
  payload?: string;
}

/** This object describes paid media content. */
export type PaidMedia = PaidMediaPhoto | PaidMediaVideo;

export interface PaidMediaPhoto {
  type: 'photo';
  photo: PhotoSize[];
}

export interface PaidMediaVideo {
  type: 'video';
  video: Video;
}

/** This object describes a paid media video. */
export interface PaidMediaPreview {
  width?: Integer;
  height?: Integer;
  duration?: Integer;
  thumbnail?: PhotoSize;
}

/** This object describes a paid media sticker set. */
export interface StarTransaction {
  id: string;
  source: TransactionParticipant;
  receiver: TransactionParticipant;
  amount: Integer;
  date: Integer;
  nanostar?: Integer;
  voucher_code?: string;
  invoice_payload?: string;
  subscription_period?: Integer;
  gift?: Gift;
  unique_gift?: UniqueGift;
}

/** Describes a transaction participant. */
export type TransactionParticipant =
  | TransactionParticipantUser
  | TransactionParticipantChat
  | TransactionParticipantChannel
  | TransactionParticipantFragmentServer
  | TransactionParticipantOther;

export interface TransactionParticipantUser {
  type: 'user';
  user: User;
}

export interface TransactionParticipantChat {
  type: 'chat';
  chat: Chat;
}

export interface TransactionParticipantChannel {
  type: 'channel';
  chat: Chat;
}

export interface TransactionParticipantFragmentServer {
  type: 'fragment_server';
}

export interface TransactionParticipantOther {
  type: 'other';
}

/** This object represents a gift. */
export interface Gift {
  id: string;
  sticker: Sticker;
  star_count: Integer;
}

/** This object represents a unique gift. */
export interface UniqueGift {
  name: string;
  number: Integer;
  model: UniqueGiftModel;
  pattern: UniqueGiftPattern;
  backdrop: UniqueGiftBackdrop;
}

/** This object describes the model of a unique gift. */
export interface UniqueGiftModel {
  name: string;
  sticker: Sticker;
}

/** This object describes the pattern of a unique gift. */
export interface UniqueGiftPattern {
  name: string;
  sticker: Sticker;
}

/** This object describes the backdrop of a unique gift. */
export interface UniqueGiftBackdrop {
  name: string;
  sticker: Sticker;
  center_color: Integer;
  edge_color: Integer;
  pattern_color: Integer;
  pattern_text_color: Integer;
  text_color: Integer;
}

/** This object represents an owned gift. */
export type OwnedGift = OwnedGiftRegular | OwnedGiftUnique;

export interface OwnedGiftRegular {
  gift: Gift;
  owned_gift_id: string;
  sender_user?: User;
  send_date: Integer;
  is_birthday?: boolean;
  is_saved?: boolean;
  can_be_transferred?: boolean;
  transfer_star_count?: Integer;
  text?: string;
  entities?: MessageEntity[];
}

export interface OwnedGiftUnique {
  gift: UniqueGift;
  owned_gift_id: string;
  sender_user?: User;
  send_date: Integer;
  is_birthday?: boolean;
  is_saved?: boolean;
  can_be_transferred?: boolean;
  transfer_star_count?: Integer;
  is_upgraded?: boolean;
  text?: string;
  entities?: MessageEntity[];
}

/** This object contains a gift received and owned by a user or a chat. */
export interface ReceivedGift {
  gift?: Gift;
  unique_gift?: UniqueGift;
  owned_gift_id?: string;
  sender_user?: User;
  send_date?: Integer;
  is_birthday?: boolean;
  text?: string;
  entities?: MessageEntity[];
}

/** This object contains the balance of Telegram Stars. */
export interface StarAmount {
  star_amount: Integer;
  nanostar_amount?: Integer;
}

/** This object describes a sticker. */
export interface Sticker {
  file_id: string;
  file_unique_id: string;
  type: string;
  width: Integer;
  height: Integer;
  is_animated: boolean;
  is_video: boolean;
  thumbnail?: PhotoSize;
  set_name?: string;
  premium_animation?: Animation;
  mask_position?: MaskPosition;
  custom_emoji_id?: string;
  needs_repainting?: boolean;
  file_size?: Integer;
}

/** This object represents a sticker set. */
export interface StickerSet {
  name: string;
  title: string;
  sticker_type: string;
  is_animated: boolean;
  is_video: boolean;
  stickers: Sticker[];
  thumbnail?: PhotoSize;
}

/** This object describes the position on the face where the mask is placed. */
export interface MaskPosition {
  point: string;
  x_shift: Float;
  y_shift: Float;
  scale: Float;
}

/** This object represents a custom emoji. */
export interface CustomEmoji {
  custom_emoji_id: string;
}

/** Describes a reaction to a message. */
export type ReactionType =
  | ReactionTypeEmoji
  | ReactionTypeCustomEmoji
  | ReactionTypePaid;

export interface ReactionTypeEmoji {
  type: 'emoji';
  emoji: string;
}

export interface ReactionTypeCustomEmoji {
  type: 'custom_emoji';
  custom_emoji_id: string;
}

export interface ReactionTypePaid {
  type: 'paid';
}

/** Describes the reactions added to a message. */
export interface MessageReactionUpdated {
  chat: Chat;
  message_id: Integer;
  date: Integer;
  old_reaction: ReactionType[];
  new_reaction: ReactionType[];
  user?: User;
  actor_chat?: Chat;
}

/** This object represents a reaction added to a message along with the number of times it was added. */
export interface ReactionCount {
  type: ReactionType;
  total_count: Integer;
}

/** This object represents a message reaction count in a chat. */
export interface MessageReactionCountUpdated {
  chat: Chat;
  message_id: Integer;
  date: Integer;
  reactions: ReactionCount[];
}

/** This object describes a message to be sent as a result of an inline query. */
export interface InlineQueryResultsButton {
  text: string;
  start_parameter?: string;
}

/** This object represents the result of an inline query that was chosen by the user. */
export interface SentWebAppMessage {
  inline_message_id?: string;
}

/** Describes a message sent on behalf of a business account. */
export interface BusinessConnection {
  id: string;
  user_chat_id: Integer;
  user: User;
  date: Integer;
  is_enabled: boolean;
  can_reply?: boolean;
  is_deleted?: boolean;
}

/** Describes the connection of the bot with a business account. */
export interface BusinessIntro {
  title?: string;
  message?: string;
  sticker?: Sticker;
}

/** Describes the business opening hours of a chat. */
export interface BusinessOpeningHours {
  opening_hours: BusinessOpeningHoursInterval[];
}

/** Describes an interval of time during which a chat is open. */
export interface BusinessOpeningHoursInterval {
  opening_minute: Integer;
  closing_minute: Integer;
}

/** This object contains information about the boost added to a chat. */
export interface ChatBoostAdded {
  boost_count: Integer;
}

/** Describes the source of a transaction. */
export type TransactionPartner =
  | TransactionPartnerUser
  | TransactionPartnerChat
  | TransactionPartnerChannel
  | TransactionPartnerFragmentServer
  | TransactionPartnerTelegramAds
  | TransactionPartnerOther;

export interface TransactionPartnerUser {
  type: 'user';
  user: User;
  invoice_payload?: string;
  paid_media?: PaidMediaPayload;
  gift?: Gift;
  unique_gift?: UniqueGift;
}

export interface TransactionPartnerChat {
  type: 'chat';
  chat: Chat;
  invoice_payload?: string;
  paid_media?: PaidMediaPayload;
  gift?: Gift;
}

export interface TransactionPartnerChannel {
  type: 'channel';
  chat: Chat;
  message_interaction_id?: Integer;
  paid_media?: PaidMediaPayload;
}

export interface TransactionPartnerFragmentServer {
  type: 'fragment_server';
}

export interface TransactionPartnerTelegramAds {
  type: 'telegram_ads';
}

export interface TransactionPartnerOther {
  type: 'other';
}

/** Describes paid media payload. */
export interface PaidMediaPayload {
  star_count: Integer;
  paid_media: PaidMedia[];
}

/** Describes a stored file. */

/** Describes the location of a chat. */
export interface BusinessLocation {
  address: string;
  location?: Location;
}

/** This object represents a topic of a message. */
export interface GiftPremiumParameters {
  month_count: Integer;
  star_count: Integer;
}

/** This object contains the number of requests and chats a bot has received in a business connection. */
export interface BusinessBotRights {
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

/** This object contains information about the bot's current access settings for managed bots. */
export interface ManagedBotAccessSettings {
  has_access_to_messages?: boolean;
  restricted_channels?: Chat[];
}

/** This object contains information about a managed bot token. */
export interface ManagedBotToken {
  bot: User;
  token: string;
  last_used?: Integer;
}

/** This object contains information about a prepared keyboard button. */
export interface PreparedKeyboardButton {
  button_id: string;
  button: KeyboardButton;
}

/** This object contains information about a prepared inline message. */
export interface PreparedInlineMessage {
  id: string;
  expiration_date: Integer;
}

/** This object contains information about a checklist. */
export interface Checklist {
  title: string;
  tasks: ChecklistTask[];
  others_can_add_tasks?: boolean;
  others_can_mark_tasks_as_done?: boolean;
}

/** This object contains information about a checklist task. */
export interface ChecklistTask {
  id: Integer;
  text: string;
  completed_by_user?: User;
  completed_in_chat_message_id?: Integer;
}

/** This object contains information about a rich message. */
export interface RichMessageContent {
  type: string;
}

export interface RichMessageProductInfo extends RichMessageContent {
  type: 'product_info';
  title: string;
  description?: string;
  photo?: PhotoSize[];
}

/** This object describes ephemeral message parameters. */
export interface EphemeralMessageParameters {
  is_persistent?: boolean;
  period: Integer;
}

/** Describes an input profile photo. */
export type InputProfilePhoto = InputProfilePhotoStatic | InputProfilePhotoAnimated | InputProfilePhotoVideo;

export interface InputProfilePhotoStatic {
  type: 'static';
  photo: InputFile;
}

export interface InputProfilePhotoAnimated {
  type: 'animated';
  animation: InputFile;
  main_frame_timestamp?: Float;
}

export interface InputProfilePhotoVideo {
  type: 'video';
  animation: InputFile;
  main_frame_timestamp?: Float;
}

/** Describes the content of a story to be posted (for API input). */
export type InputStoryContent =
  | InputStoryContentPhoto
  | InputStoryContentVideo;

export interface InputStoryContentPhoto {
  type: 'photo';
  photo: InputFile;
}

export interface InputStoryContentVideo {
  type: 'video';
  video: InputFile;
  duration: Float;
  cover_frame_timestamp?: Float;
}

/** This object represents the content of a live photo. */
export interface LivePhoto {
  static: PhotoSize;
  video: Video;
}

/** Describes the rights of a post owner. */
export interface PostOwnerRights {
  can_manage_chat?: boolean;
  can_delete_messages?: boolean;
  can_manage_video_chats?: boolean;
  can_restrict_members?: boolean;
  can_promote_members?: boolean;
  can_change_info?: boolean;
  can_invite_users?: boolean;
  can_post_messages?: boolean;
  can_edit_messages?: boolean;
  can_pin_messages?: boolean;
  can_manage_topics?: boolean;
  can_post_stories?: boolean;
  can_edit_stories?: boolean;
  can_delete_stories?: boolean;
  can_manage_direct_messages?: boolean;
}

/** Describes the reactions that can be added to messages in a chat. */
export interface ChatReactionType {
  type: string;
}

export interface ChatReactionTypeEmoji extends ChatReactionType {
  type: 'emoji';
  emoji: string;
}

export interface ChatReactionTypeCustomEmoji extends ChatReactionType {
  type: 'custom_emoji';
  custom_emoji_id: string;
}

/** Describes the reaction options available in a chat. */
export interface ChatReactions {
  type: string;
  is_enabled?: boolean;
}

export interface ChatReactionsAll extends ChatReactions {
  type: 'all';
  are_reactions_allowed?: boolean;
}

export interface ChatReactionsSome extends ChatReactions {
  type: 'some';
  reactions: ChatReactionType[];
}

/** This object describes a checklist task for sending. */
export interface ChecklistTaskInput {
  id?: Integer;
  text: string;
  parse_mode?: string;
  text_entities?: MessageEntity[];
}

/** Describes a community. */
export interface Community {
  id: Integer;
  name: string;
  description?: string;
}

// ---------------------------------------------------------------------------
// Chat Types
// ---------------------------------------------------------------------------

/** This object represents a chat. */
export interface Chat {
  id: Integer;
  type: string;
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  is_forum?: boolean;
  photo?: ChatPhoto;
  active_usernames?: string[];
  expiration_date?: Integer;
  business_intro?: BusinessIntro;
  business_location?: BusinessLocation;
  business_opening_hours?: BusinessOpeningHours;
  can_set_sticker_set?: boolean;
  can_manage_video_chats?: boolean;
  can_read_stories?: boolean;
  can_post_stories?: boolean;
  can_edit_stories?: boolean;
  can_delete_stories?: boolean;
  emoji_status_expiration_date?: Integer;
  emoji_status_custom_emoji_id?: string;
  emoji_status_needs_uploading?: boolean;
  sticker_set_name?: string;
  join_to_send_messages?: boolean;
  join_by_request?: boolean;
  description?: string;
  invite_link?: string;
  pinned_message?: Message;
  permissions?: ChatPermissions;
  slow_mode_delay?: Integer;
  message_auto_delete_time?: Integer;
  has_hidden_members?: boolean;
  has_protected_content?: boolean;
  has_restricted_voice_and_video_messages?: boolean;
  has_scheduled_messages?: boolean;
  has_been_forwarded?: boolean;
  has_forum_topics?: boolean;
  reaction_type?: ChatReactions;
  subscription_period?: Integer;
  subscription_price?: Integer;
  location?: ChatLocation;
}

/** Extended information about the chat. */
export interface ChatFullInfo {
  id: Integer;
  type: string;
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  is_forum?: boolean;
  photo?: ChatPhoto;
  active_usernames?: string[];
  expiration_date?: Integer;
  business_intro?: BusinessIntro;
  business_location?: BusinessLocation;
  business_opening_hours?: BusinessOpeningHours;
  has_aggressive_anti_spam_enabled?: boolean;
  has_hidden_members?: boolean;
  has_protected_content?: boolean;
  has_restricted_voice_and_video_messages?: boolean;
  emoji_status_expiration_date?: Integer;
  emoji_status_custom_emoji_id?: string;
  emoji_status_needs_uploading?: boolean;
  sticker_set_name?: string;
  can_set_sticker_set?: boolean;
  has_intro_sticker?: boolean;
  join_to_send_messages?: boolean;
  join_by_request?: boolean;
  description?: string;
  invite_link?: string;
  pinned_message?: Message;
  permissions?: ChatPermissions;
  slow_mode_delay?: Integer;
  message_auto_delete_time?: Integer;
  has_been_forwarded?: boolean;
  has_forum_topics?: boolean;
  can_manage_chat?: boolean;
  can_delete_messages?: boolean;
  can_manage_video_chats?: boolean;
  can_restrict_members?: boolean;
  can_promote_members?: boolean;
  can_change_info?: boolean;
  can_invite_users?: boolean;
  can_post_messages?: boolean;
  can_edit_messages?: boolean;
  can_pin_messages?: boolean;
  can_manage_topics?: boolean;
  can_post_stories?: boolean;
  can_edit_stories?: boolean;
  can_delete_stories?: boolean;
  can_manage_direct_messages?: boolean;
  is_anonymous?: boolean;
  custom_title?: string;
  supergroup_group_description?: string;
  supergroup_group_username?: string;
  can_have_sponsored_messages?: boolean;
  user_chat_boost_count?: Integer;
  location?: ChatLocation;
}

/** This object represents a location to which a chat is connected. */
export interface ChatLocation {
  location: Location;
  address: string;
}

/** This object contains information about a chat subscription. */

// ---------------------------------------------------------------------------
// Message Types
// ---------------------------------------------------------------------------

/** This object represents a message. */
export interface Message {
  message_id: Integer;
  message_thread_id?: Integer;
  from?: User;
  sender_chat?: Chat;
  date: Integer;
  chat: Chat;
  forward_from?: User;
  forward_from_chat?: Chat;
  forward_from_message_id?: Integer;
  forward_signature?: string;
  forward_origin?: MessageOrigin;
  is_topic_message?: boolean;
  is_from_offline?: boolean;
  is_scheduled?: boolean;
  has_media_spoiler?: boolean;
  media_group_id?: string;
  linked_chat_id?: Integer;
  via_bot?: User;
  via_business_bot?: User;
  via_chat_folder_invite_link?: boolean;
  via_join_request?: boolean;
  via_join_link?: boolean;
  date_unixtime?: string;

  reply_to_message?: Message;
  reply_to_story?: Story;
  reply_to_checklist_message_id?: Integer;
  reply_to_checklist_task_id?: Integer;
  reply_markup?: InlineKeyboardMarkup;

  text?: string;
  entities?: MessageEntity[];
  caption?: string;
  caption_entities?: MessageEntity[];
  show_caption_above_media?: boolean;
  new_chat_photo?: PhotoSize[];
  photo?: PhotoSize[];
  audio?: Audio;
  document?: Document;
  animation?: Animation;
  video?: Video;
  voice?: Voice;
  video_note?: VideoNote;
  sticker?: Sticker;
  sticker_set_name?: string;
  sticker_set_title?: string;
  story?: Story;
  game?: Game;
  poll?: Poll;
  dice?: Dice;
  venue?: Venue;
  location?: Location;
  contact?: Contact;
  users_shared?: UsersShared;
  chat_shared?: ChatShared;
  invoices?: Invoice[];

  new_chat_members?: User[];
  new_chat_member?: User;
  left_chat_member?: User;
  new_chat_title?: string;
  delete_chat_photo?: boolean;
  group_chat_created?: boolean;
  supergroup_chat_created?: boolean;
  channel_chat_created?: boolean;
  message_auto_delete_timer_changed?: MessageAutoDeleteTimerChanged;
  pinned_message?: MessageOrInaccessibleMessage;
  invoice?: Invoice;
  successful_payment?: SuccessfulPayment;
  refunded_payment?: RefundedPayment;
  passport_data?: PassportData;
  quote?: TextQuote;
  story_board?: StoryBoard;
  giveaway_created?: GiveawayCreated;
  giveaway?: Giveaway;
  giveaway_winners?: GiveawayWinners;
  completed_payment_discount?: TransactionPartner;

  video_chat_started?: VideoChatStarted;
  video_chat_ended?: VideoChatEnded;
  video_chat_participants_invited?: VideoChatParticipantsInvited;
  video_chat_scheduled?: VideoChatScheduled;
  chat_background_set?: ChatBackground;
  chat_boost_added?: ChatBoostAdded;
  chat_shared_folder_added?: boolean;
  chat_shared_folder_deleted?: boolean;

  service_message?: ServiceMessage;
  video_message?: VideoNote;
  web_app_data?: WebAppData;
  general_forum_topic_hidden?: boolean;
  general_forum_topic_unhidden?: boolean;
  write_access_allowed?: WriteAccessAllowed;
  chat_boost?: ChatBoost;
  removed_chat_boost?: ChatBoost;

  boost?: MessageBoost;
  paid_media?: PaidMedia;
  pass_data?: PassportData;

  story_origin?: StoryOrigin;
  story_sender_name?: string;

  rich_message?: RichMessageContent;
  ephemeral_message?: Message;
  ephemeral_message_id?: string;
  ephemeral_period?: Integer;

  live_photo?: LivePhoto;
  checklist?: Checklist;
  suggested_post_approved?: boolean;
  suggested_post_declined?: boolean;
  suggested_post_info?: SuggestedPostInfo;

  from_shared_folder?: boolean;
  to_shared_folder?: boolean;
}

/** Describes the origin of a message. */
export type MessageOrigin =
  | MessageOriginUser
  | MessageOriginHiddenUser
  | MessageOriginChat
  | MessageOriginChannel;

export interface MessageOriginUser {
  type: 'user';
  date: Integer;
  from_user: User;
}

export interface MessageOriginHiddenUser {
  type: 'hidden_user';
  date: Integer;
  sender_user_name: string;
}

export interface MessageOriginChat {
  type: 'chat';
  date: Integer;
  sender_chat: Chat;
  author_signature?: string;
}

export interface MessageOriginChannel {
  type: 'channel';
  date: Integer;
  chat: Chat;
  message_id: Integer;
  author_signature?: string;
}

/** This object describes a message boost. */
export interface MessageBoost {
  boost_id: string;
  add_date: Integer;
  expiration_date: Integer;
  source: ChatBoostSource;
  count: Integer;
}

/** Describes an invoice message. */
export interface Invoice {
  title: string;
  description: string;
  start_parameter?: string;
  currency: string;
  total_amount: Integer;
  is_test: boolean;
}

/** This object contains a detailed description of a game. */
export interface Game {
  title: string;
  description: string;
  photo: PhotoSize[];
  text?: string;
  text_entities?: MessageEntity[];
  animation?: Animation;
}

/** This object represents an animated dice. */
export interface Dice {
  emoji: string;
  value: Integer;
}

/** This object represents a message that was deleted. */
export interface InaccessibleMessage {
  chat: Chat;
  message_id: Integer;
  date: Integer;
}

/** This object represents a message or an inaccessible message. */
export type MessageOrInaccessibleMessage = Message | InaccessibleMessage;

/** This object describes a paid media extended. */
export interface ExtendedMediaPreview {
  source: string;
}

/** Describes an inline message sent via a bot. */
export interface ExternalReplyInfo {
  type: string;
}

export interface TextQuote {
  text: string;
  entities?: MessageEntity[];
  position?: Integer;
  is_manual?: boolean;
}

export interface MessageAutoDeleteTimerChanged {
  message_auto_delete_time: Integer;
}

export interface VideoChatStarted {
  duration?: Integer;
}

export interface VideoChatEnded {
  duration: Integer;
}

export interface VideoChatParticipantsInvited {
  users?: User[];
}

export interface VideoChatScheduled {
  start_date: Integer;
}

export interface WriteAccessAllowed {
  from_request?: boolean;
  web_app_name?: string;
  from_attachment_menu?: boolean;
}

export interface UsersShared {
  users: User[];
  button_id: Integer;
  button_name?: string;
  user_is_bot?: boolean;
  button_request_id?: string;
}

export interface ChatShared {
  chat_id: Integer;
  title?: string;
  username?: string;
  photo?: ChatPhoto;
  button_id?: Integer;
  button_name?: string;
  button_request_id?: string;
}

export interface RefundedPayment {
  currency: string;
  total_amount: Integer;
  invoice_payload: string;
  telegram_payment_charge_id: string;
  provider_payment_charge_id?: string;
}

export interface GiveawayCreated {
  prize_star_count?: Integer;
}

export interface Giveaway {
  chats: Chat[];
  winners_selection_date: Integer;
  winner_count: Integer;
  only_new_members?: boolean;
  has_public_winners?: boolean;
  prize_description?: string;
  country_codes?: string[];
  prize_star_count?: Integer;
}

export interface GiveawayWinners {
  chat: Chat;
  giveaway_message_id: Integer;
  winners_selection_date: Integer;
  winner_count: Integer;
  winners?: User[];
  additional_chat_count?: Integer;
  prize_star_count?: Integer;
  prize_description?: string;
  unclaimed_prize_count?: Integer;
}

export interface ChatBackground {
  background: ChatBackgroundType;
  restore_date?: Integer;
  is_unmoving?: boolean;
}

export type ChatBackgroundType =
  | ChatBackgroundTypeFill
  | ChatBackgroundTypeWallpaper
  | ChatBackgroundTypeTheme;

export interface ChatBackgroundTypeFill {
  type: 'fill';
  fill: BackgroundFill;
}

export interface ChatBackgroundTypeWallpaper {
  type: 'wallpaper';
  wallpaper: ChatBackgroundType;
  is_blurred?: boolean;
}

export interface ChatBackgroundTypeTheme {
  type: 'theme';
}

export type BackgroundFill =
  | BackgroundFillSolid
  | BackgroundFillGradient
  | BackgroundFillFreeformGradient;

export interface BackgroundFillSolid {
  color: Integer;
}

export interface BackgroundFillGradient {
  top_color: Integer;
  bottom_color: Integer;
  rotation_angle: Integer;
}

export interface BackgroundFillFreeformGradient {
  colors: Integer[];
}

export interface SuggestedPostInfo {
  schedule_date?: Integer;
}

export interface StoryBoard {
  cover: StoryBoardCover;
  stories: StoryBoardStory[];
}

export interface StoryBoardCover {
  file: Document;
  width: Integer;
  height: Integer;
  position: StoryBoardPosition;
}

export interface StoryBoardStory {
  file: Document;
  duration: Float;
  width: Integer;
  height: Integer;
}

export interface StoryBoardPosition {
  x: Float;
  y: Float;
  scale: Float;
  rotation: Float;
}

export interface ServiceMessage {
  type: string;
}

// ---------------------------------------------------------------------------
// Keyboard Types
// ---------------------------------------------------------------------------

/** This object represents an inline keyboard. */
export interface InlineKeyboardMarkup {
  inline_keyboard: InlineKeyboardButton[][];
}

/** This object represents one button of an inline keyboard. */
export interface InlineKeyboardButton {
  text: string;
  url?: string;
  callback_data?: string;
  web_app?: WebAppInfo;
  login_url?: LoginUrl;
  switch_inline_query?: string;
  switch_inline_query_current_chat?: string;
  switch_inline_query_chosen_chat?: SwitchInlineQueryChosenChat;
  pay?: boolean;
  copy_text?: CopyTextButton;
  callback_game?: CallbackGame;
}

/** This object represents a custom keyboard. */
export interface ReplyKeyboardMarkup {
  keyboard: KeyboardButton[][];
  is_persistent?: boolean;
  resize_keyboard?: boolean;
  one_time_keyboard?: boolean;
  input_field_placeholder?: string;
  selective?: boolean;
  is_custom_keyboard?: boolean;
}

/** This object represents one button of the reply keyboard. */
export interface KeyboardButton {
  text: string;
  request_users?: KeyboardButtonRequestUsers;
  request_chat?: KeyboardButtonRequestChat;
  request_contact?: boolean;
  request_location?: boolean;
  request_poll?: KeyboardButtonRequestPoll;
  web_app?: WebAppInfo;
  request_user?: KeyboardButtonRequestUsers;
  request_chat_is_channel?: boolean;
}

export interface KeyboardButtonRequestUsers {
  request_id: Integer;
  user_is_bot?: boolean;
  user_is_premium?: boolean;
  max_quantity?: Integer;
  request_name?: boolean;
  request_username?: boolean;
  request_photo?: boolean;
}

export interface KeyboardButtonRequestChat {
  request_id: Integer;
  chat_is_channel?: boolean;
  chat_is_group?: boolean;
  chat_is_supergroup?: boolean;
  chat_is_created?: boolean;
  user_administrator_rights?: ChatAdministratorRights;
  bot_administrator_rights?: ChatAdministratorRights;
  request_name?: boolean;
  request_username?: boolean;
  request_photo?: boolean;
}

export interface KeyboardButtonRequestPoll {
  request_id: Integer;
  question?: string;
  question_parse_mode?: string;
  question_entities?: MessageEntity[];
  is_anonymous?: boolean;
  allowed_poll_types?: string[];
}

/** This object describes the source of a login URL. */
export interface LoginUrl {
  url: string;
  forward_text?: string;
  bot_username?: string;
  request_write_access?: boolean;
}

/** This object represents one button of an inline keyboard that switches the current user to inline mode in a chosen chat with an appropriate configuration. */
export interface SwitchInlineQueryChosenChat {
  query?: string;
  allow_user_chats?: boolean;
  allow_bot_chats?: boolean;
  allow_group_chats?: boolean;
  allow_channel_chats?: boolean;
}

/** This object represents an inline keyboard button that copies specified text to the clipboard. */
export interface CopyTextButton {
  text: string;
}

/** This object, by default, describes one button of the message reply markup. */
export type ReplyMarkup =
  | InlineKeyboardMarkup
  | ReplyKeyboardMarkup
  | ReplyKeyboardRemove
  | ForceReply;

/** This object represents a Telegram Web App. */
export interface CallbackGame {}

/** Upon pressing a user-defined key, the client will send the bot the data from the callback_query field. */
export interface CallbackQuery {
  id: string;
  from: User;
  message?: Message;
  chat_instance: string;
  data?: string;
  game_short_name?: string;
  inline_message_id?: string;
}

/** This object represents an incoming callback query from a callback button in an inline keyboard. */

/** This object represents a forced reply. */
export interface ForceReply {
  force_reply: boolean;
  selective?: boolean;
  input_field_placeholder?: string;
}

/** This object represents an object used to remove the reply keyboard. */
export interface ReplyKeyboardRemove {
  remove_keyboard: boolean;
  selective?: boolean;
}

/** This object contains information about a link preview. */
export interface LinkPreviewOptions {
  is_disabled?: boolean;
  url?: string;
  prefer_small_media?: boolean;
  prefer_large_media?: boolean;
  show_above_text?: boolean;
}

// ---------------------------------------------------------------------------
// Update Types
// ---------------------------------------------------------------------------

/** This object represents an incoming update. */
export interface Update {
  update_id: Integer;
  message?: Message;
  edited_message?: Message;
  channel_post?: Message;
  edited_channel_post?: Message;
  business_connection?: BusinessConnection;
  business_message?: Message;
  edited_business_message?: Message;
  deleted_business_messages?: InaccessibleMessage[];
  message_reaction?: MessageReactionUpdated;
  message_reaction_count?: MessageReactionCountUpdated;
  inline_query?: InlineQuery;
  chosen_inline_result?: ChosenInlineResult;
  callback_query?: CallbackQuery;
  shipping_query?: ShippingQuery;
  pre_checkout_query?: PreCheckoutQuery;
  poll?: Poll;
  poll_answer?: PollAnswer;
  my_chat_member?: ChatMemberUpdated;
  chat_member?: ChatMemberUpdated;
  chat_join_request?: ChatJoinRequest;
  chat_boost?: ChatBoost;
  removed_chat_boost?: ChatBoost;
  purchased_paid_media?: SuccessfulPayment;
  gift?: OwnedGift;
  gift_non_added?: OwnedGift;
  subscription?: ChatSubscription;
  managed_bot?: ManagedBotToken;
  verified_checks?: VerifiedChecks;
  stopped_message_generation?: StoppedMessageGeneration;
  guest_message?: GuestMessage;
  reaction?: ReactionType;
}

export interface StoppedMessageGeneration {
  chat: Chat;
  message_id: Integer;
  chat_instance: string;
  data?: string;
}

export interface GuestMessage {
  chat: Chat;
  guest_query_id: string;
  text: string;
}

export interface VerifiedChecks {
  checks: VerifiedCheck[];
}

export interface VerifiedCheck {
  date: Integer;
  status: string;
  source: string;
}

// ---------------------------------------------------------------------------
// Input Types
// ---------------------------------------------------------------------------

/** This object represents the contents of a file to be uploaded. */
export type InputFile =
  | string
  | Buffer
  | Stream;

/** This object represents one result of an inline query. */
export type InputMedia =
  | InputMediaAnimation
  | InputMediaDocument
  | InputMediaAudio
  | InputMediaPhoto
  | InputMediaVideo;

export interface InputMediaAnimation {
  type: 'animation';
  media: InputFile;
  thumbnail?: InputFile;
  caption?: string;
  parse_mode?: string;
  caption_entities?: MessageEntity[];
  show_caption_above_media?: boolean;
  width?: Integer;
  height?: Integer;
  duration?: Integer;
  has_spoiler?: boolean;
}

export interface InputMediaDocument {
  type: 'document';
  media: InputFile;
  thumbnail?: InputFile;
  caption?: string;
  parse_mode?: string;
  caption_entities?: MessageEntity[];
  show_caption_above_media?: boolean;
  disable_content_type_detection?: boolean;
}

export interface InputMediaAudio {
  type: 'audio';
  media: InputFile;
  thumbnail?: InputFile;
  caption?: string;
  parse_mode?: string;
  caption_entities?: MessageEntity[];
  duration?: Integer;
  performer?: string;
  title?: string;
}

export interface InputMediaPhoto {
  type: 'photo';
  media: InputFile;
  thumbnail?: InputFile;
  caption?: string;
  parse_mode?: string;
  caption_entities?: MessageEntity[];
  show_caption_above_media?: boolean;
  has_spoiler?: boolean;
}

export interface InputMediaVideo {
  type: 'video';
  media: InputFile;
  thumbnail?: InputFile;
  caption?: string;
  parse_mode?: string;
  caption_entities?: MessageEntity[];
  show_caption_above_media?: boolean;
  width?: Integer;
  height?: Integer;
  duration?: Integer;
  supports_streaming?: boolean;
  has_spoiler?: boolean;
}

/** Describes the paid media to be sent. */
export type InputPaidMedia =
  | InputPaidMediaPhoto
  | InputPaidMediaVideo;

export interface InputPaidMediaPhoto {
  type: 'photo';
  media: InputFile;
  thumbnail?: InputFile;
}

export interface InputPaidMediaVideo {
  type: 'video';
  media: InputFile;
  thumbnail?: InputFile;
  cover?: InputFile;
  start_timestamp?: Integer;
  caption?: string;
  parse_mode?: string;
  caption_entities?: MessageEntity[];
  show_caption_above_media?: boolean;
  supports_streaming?: boolean;
  duration?: Integer;
  width?: Integer;
  height?: Integer;
  has_spoiler?: boolean;
}

/** Describes the input content of a rich message. */
export type InputRichMessageContent = InputRichMessageContentProductInfo;

export interface InputRichMessageContentProductInfo {
  type: 'product_info';
  title: string;
  description?: string;
  photo?: InputFile;
  parse_mode?: string;
  entities?: MessageEntity[];
}

/** Describes the input content of a story to be posted. */
export type InputStoryContentLocal =
  | InputStoryContentLocalPhoto
  | InputStoryContentLocalVideo;

export interface InputStoryContentLocalPhoto {
  type: 'photo';
  photo: InputFile;
}

export interface InputStoryContentLocalVideo {
  type: 'video';
  video: InputFile;
  duration: Float;
  cover_frame_timestamp?: Float;
}

/** Describes the input content of a paid media. */
export type InputChecklistTask = {
  id?: Integer;
  text: string;
  parse_mode?: string;
  text_entities?: MessageEntity[];
};

/** Describes a sticker to be set. */
export type InputSticker = {
  sticker: InputFile;
  format: string;
  emoji_list: string[];
  mask_position?: MaskPosition;
  keywords?: string[];
  custom_emoji_id?: string;
};

/** Describes a reaction type to be set. */
export type InputStoryAreaType =
  | InputStoryAreaTypeLocation
  | InputStoryAreaTypeVenue
  | InputStoryAreaTypeReaction
  | InputStoryAreaTypeLink;

export interface InputStoryAreaTypeLocation {
  type: 'location';
  latitude: Float;
  longitude: Float;
  zoom?: Integer;
  horizontal_accuracy?: Float;
}

export interface InputStoryAreaTypeVenue {
  type: 'venue';
  venue_id: string;
}

export interface InputStoryAreaTypeReaction {
  type: 'reaction';
  reaction_type: ReactionType;
}

export interface InputStoryAreaTypeLink {
  type: 'link';
  url: string;
}

/** Describes an input story area. */
export interface InputStoryArea {
  position: StoryAreaPosition;
  type: InputStoryAreaType;
}

// ---------------------------------------------------------------------------
// Passport Types
// ---------------------------------------------------------------------------

/** Describes Telegram Passport data shared with the bot by the user. */
export interface PassportData {
  data: EncryptedPassportElement[];
  credentials: EncryptedCredentials;
}

/** Describes documents or other Telegram Passport elements shared with the bot. */
export interface EncryptedPassportElement {
  type: string;
  data?: string;
  phone_number?: string;
  email?: string;
  files?: PassportFile[];
  translation?: PassportFile[];
  selfie?: PassportFile;
}

/** Describes a file uploaded to Telegram Passport. */
export interface PassportFile {
  file_id: string;
  file_unique_id: string;
  file_date: Integer;
  file_size: Integer;
}

/** Describes the data decrypting with credentials. */
export interface EncryptedCredentials {
  data: string;
  hash: string;
  secret: string;
}

// ---------------------------------------------------------------------------
// Payments Types
// ---------------------------------------------------------------------------

/** Describes Telegram Stars transactions. */
export interface StarTransactions {
  star_transactions: StarTransaction[];
}

/** Describes a gift. */
export interface Gifts {
  gifts: Gift[];
}

// ---------------------------------------------------------------------------
// ChatBoost Types
// ---------------------------------------------------------------------------

/** Describes boosts obtained by a user. */
export interface UserChatBoosts {
  boosts: ChatBoost[];
}

// ============================================================================
// OPTIONS INTERFACES (method parameters)
// ============================================================================

/** Options for the TelegramBot constructor. */
export interface TelegramBotOptions {
  /** Set to true to enable polling, or an object with polling options. */
  polling?: boolean | PollingOptions;
  /** Set to true to enable WebHook, or an object with WebHook options. */
  webHook?: boolean | WebHookOptions;
  /** Set to true to use the test environment. */
  testEnvironment?: boolean;
  /** Set to true to stop after the first regex match. */
  onlyFirstMatch?: boolean;
  /** Options added to every request to the Telegram API. */
  request?: Record<string, unknown>;
  /** API Base URL. Useful for proxying and testing. Default: 'https://api.telegram.org'. */
  baseApiUrl?: string;
  /** Allow passing file paths as arguments when sending files. Default: true. */
  filepath?: boolean;
  /** Set to true for forward-compatibility on unhandled rejections. */
  badRejection?: boolean;
}

/** Polling options. */
export interface PollingOptions {
  /** Timeout in seconds for long polling. */
  timeout?: number | string;
  /** Interval between requests in milliseconds. Default: 300. */
  interval?: number | string;
  /** Start polling immediately. Default: true. */
  autoStart?: boolean;
  /** Parameters sent in polling API requests. */
  params?: PollingParams;
  /** Restart polling on consecutive calls. Default: true. */
  restart?: boolean;
}

/** Polling API request parameters. */
export interface PollingParams {
  timeout?: number;
  limit?: number;
  offset?: number;
  allowed_updates?: string[];
}

/** WebHook options. */
export interface WebHookOptions {
  /** Host to bind to. Default: '0.0.0.0'. */
  host?: string;
  /** Port to bind to. Default: 8443. */
  port?: number;
  /** Path to file with PEM private key. */
  key?: string;
  /** Path to file with PEM certificate (public). */
  cert?: string;
  /** Path to file with PFX private key and certificate chain. */
  pfx?: string;
  /** Open webhook immediately. Default: true. */
  autoOpen?: boolean;
  /** Options passed to `https.createServer()`. */
  https?: https.ServerOptions;
  /** An endpoint for health checks that always responds with 200 OK. Default: '/healthz'. */
  healthEndpoint?: string;
}

/** Common query options passed to most API methods. */
export interface FormQueryOptions {
  /** Additional query parameters (snake_case keys sent as form data). */
  [key: string]: unknown;
}

// ============================================================================
// REPLY OPTIONS
// ============================================================================

/** Options for message sending methods that support reply_markup. */
export interface SendMessageOptions extends FormQueryOptions {
  message_thread_id?: Integer;
  reply_parameters?: ReplyParameters;
  parse_mode?: string;
  entities?: MessageEntity[];
  link_preview_options?: LinkPreviewOptions;
  disable_notification?: boolean;
  protect_content?: boolean;
  allow_paid_broadcast?: boolean;
  message_effect_id?: string;
  business_connection_id?: string;
  reply_markup?: ReplyMarkup;
}

/** Options for sendPhoto. */
export interface SendPhotoOptions extends FormQueryOptions {
  business_connection_id?: string;
  message_thread_id?: Integer;
  caption?: string;
  parse_mode?: string;
  caption_entities?: MessageEntity[];
  show_caption_above_media?: boolean;
  has_spoiler?: boolean;
  disable_notification?: boolean;
  protect_content?: boolean;
  allow_paid_broadcast?: boolean;
  message_effect_id?: string;
  reply_parameters?: ReplyParameters;
  reply_markup?: ReplyMarkup;
}

/** Options for sendAudio. */
export interface SendAudioOptions extends FormQueryOptions {
  business_connection_id?: string;
  message_thread_id?: Integer;
  caption?: string;
  parse_mode?: string;
  caption_entities?: MessageEntity[];
  duration?: Integer;
  performer?: string;
  title?: string;
  thumbnail?: InputFile;
  disable_notification?: boolean;
  protect_content?: boolean;
  allow_paid_broadcast?: boolean;
  message_effect_id?: string;
  reply_parameters?: ReplyParameters;
  reply_markup?: ReplyMarkup;
}

/** Options for sendDocument. */
export interface SendDocumentOptions extends FormQueryOptions {
  business_connection_id?: string;
  message_thread_id?: Integer;
  caption?: string;
  parse_mode?: string;
  caption_entities?: MessageEntity[];
  disable_content_type_detection?: boolean;
  thumbnail?: InputFile;
  disable_notification?: boolean;
  protect_content?: boolean;
  allow_paid_broadcast?: boolean;
  message_effect_id?: string;
  reply_parameters?: ReplyParameters;
  reply_markup?: ReplyMarkup;
}

/** Options for sendVideo. */
export interface SendVideoOptions extends FormQueryOptions {
  business_connection_id?: string;
  message_thread_id?: Integer;
  caption?: string;
  parse_mode?: string;
  caption_entities?: MessageEntity[];
  show_caption_above_media?: boolean;
  duration?: Integer;
  width?: Integer;
  height?: Integer;
  thumbnail?: InputFile;
  supports_streaming?: boolean;
  has_spoiler?: boolean;
  disable_notification?: boolean;
  protect_content?: boolean;
  allow_paid_broadcast?: boolean;
  message_effect_id?: string;
  reply_parameters?: ReplyParameters;
  reply_markup?: ReplyMarkup;
}

/** Options for sendAnimation. */
export interface SendAnimationOptions extends FormQueryOptions {
  business_connection_id?: string;
  message_thread_id?: Integer;
  caption?: string;
  parse_mode?: string;
  caption_entities?: MessageEntity[];
  show_caption_above_media?: boolean;
  width?: Integer;
  height?: Integer;
  duration?: Integer;
  thumbnail?: InputFile;
  has_spoiler?: boolean;
  disable_notification?: boolean;
  protect_content?: boolean;
  allow_paid_broadcast?: boolean;
  message_effect_id?: string;
  reply_parameters?: ReplyParameters;
  reply_markup?: ReplyMarkup;
}

/** Options for sendVoice. */
export interface SendVoiceOptions extends FormQueryOptions {
  business_connection_id?: string;
  message_thread_id?: Integer;
  caption?: string;
  parse_mode?: string;
  caption_entities?: MessageEntity[];
  duration?: Integer;
  disable_notification?: boolean;
  protect_content?: boolean;
  allow_paid_broadcast?: boolean;
  message_effect_id?: string;
  reply_parameters?: ReplyParameters;
  reply_markup?: ReplyMarkup;
}

/** Options for sendVideoNote. */
export interface SendVideoNoteOptions extends FormQueryOptions {
  business_connection_id?: string;
  message_thread_id?: Integer;
  duration?: Integer;
  length?: Integer;
  thumbnail?: InputFile;
  disable_notification?: boolean;
  protect_content?: boolean;
  allow_paid_broadcast?: boolean;
  message_effect_id?: string;
  reply_parameters?: ReplyParameters;
  reply_markup?: ReplyMarkup;
}

/** Options for sendSticker. */
export interface SendStickerOptions extends FormQueryOptions {
  business_connection_id?: string;
  message_thread_id?: Integer;
  emoji?: string;
  disable_notification?: boolean;
  protect_content?: boolean;
  allow_paid_broadcast?: boolean;
  message_effect_id?: string;
  reply_parameters?: ReplyParameters;
  reply_markup?: ReplyMarkup;
}

/** Options for sendLocation. */
export interface SendLocationOptions extends FormQueryOptions {
  business_connection_id?: string;
  message_thread_id?: Integer;
  horizontal_accuracy?: Float;
  heading?: Integer;
  proximity_alert_radius?: Integer;
  live_period?: Integer;
  disable_notification?: boolean;
  protect_content?: boolean;
  allow_paid_broadcast?: boolean;
  message_effect_id?: string;
  reply_parameters?: ReplyParameters;
  reply_markup?: ReplyMarkup;
}

/** Options for sendVenue. */
export interface SendVenueOptions extends FormQueryOptions {
  business_connection_id?: string;
  message_thread_id?: Integer;
  foursquare_id?: string;
  foursquare_type?: string;
  google_place_id?: string;
  google_place_type?: string;
  disable_notification?: boolean;
  protect_content?: boolean;
  allow_paid_broadcast?: boolean;
  message_effect_id?: string;
  reply_parameters?: ReplyParameters;
  reply_markup?: ReplyMarkup;
}

/** Options for sendContact. */
export interface SendContactOptions extends FormQueryOptions {
  business_connection_id?: string;
  message_thread_id?: Integer;
  last_name?: string;
  vcard?: string;
  disable_notification?: boolean;
  protect_content?: boolean;
  allow_paid_broadcast?: boolean;
  message_effect_id?: string;
  reply_parameters?: ReplyParameters;
  reply_markup?: ReplyMarkup;
}

/** Options for sendPoll. */
export interface SendPollOptions extends FormQueryOptions {
  business_connection_id?: string;
  message_thread_id?: Integer;
  question_parse_mode?: string;
  question_entities?: MessageEntity[];
  is_anonymous?: boolean;
  type?: string;
  allows_multiple_answers?: boolean;
  correct_option_id?: Integer;
  explanation?: string;
  explanation_parse_mode?: string;
  explanation_entities?: MessageEntity[];
  open_period?: Integer;
  close_date?: Integer;
  is_closed?: boolean;
  disable_notification?: boolean;
  protect_content?: boolean;
  allow_paid_broadcast?: boolean;
  message_effect_id?: string;
  reply_parameters?: ReplyParameters;
  reply_markup?: ReplyMarkup;
}

/** Options for sendDice. */
export interface SendDiceOptions extends FormQueryOptions {
  business_connection_id?: string;
  message_thread_id?: Integer;
  emoji?: string;
  disable_notification?: boolean;
  protect_content?: boolean;
  allow_paid_broadcast?: boolean;
  message_effect_id?: string;
  reply_parameters?: ReplyParameters;
  reply_markup?: ReplyMarkup;
}

/** Options for sendChatAction. */
export interface SendChatActionOptions extends FormQueryOptions {
  business_connection_id?: string;
  message_thread_id?: Integer;
}

/** Options for sendGame. */
export interface SendGameOptions extends FormQueryOptions {
  business_connection_id?: string;
  message_thread_id?: Integer;
  disable_notification?: boolean;
  protect_content?: boolean;
  allow_paid_broadcast?: boolean;
  message_effect_id?: string;
  reply_parameters?: ReplyParameters;
  reply_markup?: InlineKeyboardMarkup;
}

/** Options for sendInvoice. */
export interface SendInvoiceOptions extends FormQueryOptions {
  max_tip_amount?: Integer;
  suggested_tip_amounts?: Integer[];
  start_parameter?: string;
  provider_data?: string;
  photo_url?: string;
  photo_size?: Integer;
  photo_width?: Integer;
  photo_height?: Integer;
  need_name?: boolean;
  need_phone_number?: boolean;
  need_email?: boolean;
  need_shipping_address?: boolean;
  send_phone_number_to_provider?: boolean;
  send_email_to_provider?: boolean;
  is_flexible?: boolean;
  disable_notification?: boolean;
  protect_content?: boolean;
  allow_paid_broadcast?: boolean;
  message_effect_id?: string;
  reply_parameters?: ReplyParameters;
  reply_markup?: InlineKeyboardMarkup;
  message_thread_id?: Integer;
}

/** Options for sendPaidMedia. */
export interface SendPaidMediaOptions extends FormQueryOptions {
  business_connection_id?: string;
  message_thread_id?: Integer;
  caption?: string;
  parse_mode?: string;
  caption_entities?: MessageEntity[];
  show_caption_above_media?: boolean;
  payload?: string;
  disable_notification?: boolean;
  protect_content?: boolean;
  allow_paid_broadcast?: boolean;
  reply_parameters?: ReplyParameters;
  reply_markup?: ReplyMarkup;
}

/** Options for sendDice. */
export interface SetMessageReactionOptions extends FormQueryOptions {
  is_big?: boolean;
}

/** Parameters for reply_parameters. */
export interface ReplyParameters {
  message_id: Integer;
  chat_id?: Integer | string;
  allow_sending_without_reply?: boolean;
  quote?: string;
  quote_parse_mode?: string;
  quote_entities?: MessageEntity[];
  quote_position?: Integer;
  is_quote?: boolean;
}

/** Parameters for setMessageReaction. */

// ============================================================================
// BOT CLASS
// ============================================================================

// Error classes
export class BaseError extends Error {
  code: string;
  constructor(code: string, message: string);
  toJSON(): { code: string; message: string };
}

export class FatalError extends BaseError {
  constructor(data: string | Error);
}

export class ParseError extends BaseError {
  response: IncomingMessage;
  constructor(message: string, response: IncomingMessage);
}

export class TelegramError extends BaseError {
  response: IncomingMessage;
  constructor(message: string, response: IncomingMessage);
}

export default class TelegramBot extends EventEmitter {
  constructor(token: string, options?: TelegramBotOptions);

  /** The bot token. */
  readonly token: string;

  /** The bot options. */
  readonly options: TelegramBotOptions;

  /** The different errors the library uses. */
  static errors: {
    BaseError: typeof BaseError;
    FatalError: typeof FatalError;
    ParseError: typeof ParseError;
    TelegramError: typeof TelegramError;
  };

  /** The types of message updates the library handles. */
  static messageTypes: string[];

  // --- Event Overloads --------------------------------------------------------

  on(event: 'message', listener: (message: Message, metadata: { type?: string }) => void): this;
  on(event: 'edited_message', listener: (message: Message) => void): this;
  on(event: 'edited_message_text', listener: (message: Message) => void): this;
  on(event: 'edited_message_caption', listener: (message: Message) => void): this;
  on(event: 'channel_post', listener: (message: Message) => void): this;
  on(event: 'edited_channel_post', listener: (message: Message) => void): this;
  on(event: 'edited_channel_post_text', listener: (message: Message) => void): this;
  on(event: 'edited_channel_post_caption', listener: (message: Message) => void): this;
  on(event: 'business_connection', listener: (connection: BusinessConnection) => void): this;
  on(event: 'business_message', listener: (message: Message) => void): this;
  on(event: 'edited_business_message', listener: (message: Message) => void): this;
  on(event: 'deleted_business_messages', listener: (messages: InaccessibleMessage[]) => void): this;
  on(event: 'message_reaction', listener: (update: MessageReactionUpdated) => void): this;
  on(event: 'message_reaction_count', listener: (update: MessageReactionCountUpdated) => void): this;
  on(event: 'inline_query', listener: (query: InlineQuery) => void): this;
  on(event: 'chosen_inline_result', listener: (result: ChosenInlineResult) => void): this;
  on(event: 'callback_query', listener: (query: CallbackQuery) => void): this;
  on(event: 'shipping_query', listener: (query: ShippingQuery) => void): this;
  on(event: 'pre_checkout_query', listener: (query: PreCheckoutQuery) => void): this;
  on(event: 'poll', listener: (poll: Poll) => void): this;
  on(event: 'poll_answer', listener: (answer: PollAnswer) => void): this;
  on(event: 'chat_member', listener: (update: ChatMemberUpdated) => void): this;
  on(event: 'my_chat_member', listener: (update: ChatMemberUpdated) => void): this;
  on(event: 'chat_join_request', listener: (request: ChatJoinRequest) => void): this;
  on(event: 'chat_boost', listener: (boost: ChatBoost) => void): this;
  on(event: 'removed_chat_boost', listener: (boost: ChatBoost) => void): this;
  on(event: 'text', listener: (message: Message) => void): this;
  on(event: 'animation', listener: (message: Message) => void): this;
  on(event: 'audio', listener: (message: Message) => void): this;
  on(event: 'contact', listener: (message: Message) => void): this;
  on(event: 'dice', listener: (message: Message) => void): this;
  on(event: 'document', listener: (message: Message) => void): this;
  on(event: 'game', listener: (message: Message) => void): this;
  on(event: 'invoice', listener: (message: Message) => void): this;
  on(event: 'location', listener: (message: Message) => void): this;
  on(event: 'photo', listener: (message: Message) => void): this;
  on(event: 'pinned_message', listener: (message: Message) => void): this;
  on(event: 'poll', listener: (message: Message) => void): this;
  on(event: 'sticker', listener: (message: Message) => void): this;
  on(event: 'successful_payment', listener: (message: Message) => void): this;
  on(event: 'video', listener: (message: Message) => void): this;
  on(event: 'video_note', listener: (message: Message) => void): this;
  on(event: 'voice', listener: (message: Message) => void): this;
  on(event: 'video_chat_started', listener: (message: Message) => void): this;
  on(event: 'video_chat_ended', listener: (message: Message) => void): this;
  on(event: 'video_chat_participants_invited', listener: (message: Message) => void): this;
  on(event: 'video_chat_scheduled', listener: (message: Message) => void): this;
  on(event: 'message_auto_delete_timer_changed', listener: (message: Message) => void): this;
  on(event: 'chat_invite_link', listener: (message: Message) => void): this;
  on(event: 'chat_member_updated', listener: (message: Message) => void): this;
  on(event: 'web_app_data', listener: (message: Message) => void): this;
  on(event: 'passport_data', listener: (message: Message) => void): this;
  on(event: string | symbol, listener: (...args: any[]) => void): this;

  // --- Polling / WebHook ------------------------------------------------------

  /** Start polling. Rejects returned promise if a WebHook is being used. */
  startPolling(options?: { restart?: boolean }): Promise<void>;

  /** Deprecated alias for startPolling(). */
  initPolling(): Promise<void>;

  /** Stops polling after the last polling request resolves. */
  stopPolling(options?: { cancel?: boolean; reason?: string }): Promise<void>;

  /** Return true if polling. Otherwise, false. */
  isPolling(): boolean;

  /** Open webhook. Rejects returned promise if polling is being used. */
  openWebHook(): Promise<void>;

  /** Close webhook after closing all current connections. */
  closeWebHook(): Promise<void>;

  /** Return true if using webhook and it is open. */
  hasOpenWebHook(): boolean;

  // --- File Helpers -----------------------------------------------------------

  /**
   * Get link for file. Link will be valid for 1 hour.
   * @param fileId File identifier
   * @param form Additional query options
   */
  getFileLink(fileId: string, form?: FormQueryOptions): Promise<string>;

  /**
   * Return a readable stream for file.
   * @param fileId File identifier
   * @param form Additional query options
   */
  getFileStream(fileId: string, form?: FormQueryOptions): Stream;

  /**
   * Downloads file to the specified folder.
   * @param fileId File identifier
   * @param downloadDir Absolute path to the folder
   * @param form Additional query options
   */
  downloadFile(fileId: string, downloadDir: string, form?: FormQueryOptions): Promise<string>;

  // --- Text/Reply Listeners ---------------------------------------------------

  /** Register a RegExp to test against an incoming text message. */
  onText(regexp: RegExp, callback: (msg: Message, match: RegExpExecArray | null) => void): void;

  /** Remove a listener registered with onText(). */
  removeTextListener(regexp: RegExp): { regexp: RegExp; callback: Function } | null;

  /** Remove all listeners registered with onText(). */
  clearTextListeners(): void;

  /** Register a reply to wait for a message response. */
  onReplyToMessage(chatId: number | string, messageId: number, callback: (msg: Message) => void): number;

  /** Remove a reply listener. */
  removeReplyListener(replyListenerId: number): { id: number; chatId: number | string; messageId: number; callback: Function } | null;

  /** Remove all reply listeners. */
  clearReplyListeners(): void;

  // --- Process Update ---------------------------------------------------------

  /**
   * Process an update; emitting the proper events and executing regexp callbacks.
   * @param update Telegram Update object
   */
  processUpdate(update: Update): void;

  // ==========================================================================
  // TELEGRAM BOT API METHODS
  // ==========================================================================

  // --- Getting Updates --------------------------------------------------------

  /**
   * Use this method to receive incoming updates using long polling.
   * @see https://core.telegram.org/bots/api#getupdates
   */
  getUpdates(form?: {
    offset?: Integer;
    limit?: Integer;
    timeout?: Integer;
    allowed_updates?: string[];
  }): Promise<Update[]>;

  /**
   * Specify a URL to receive incoming updates via an outgoing WebHook.
   * @see https://core.telegram.org/bots/api#setwebhook
   */
  setWebHook(
    url: string,
    options?: {
      certificate?: InputFile;
      ip_address?: string;
      max_connections?: Integer;
      allowed_updates?: string[];
      drop_pending_updates?: boolean;
      secret_token?: string;
    },
    fileOptions?: FormQueryOptions,
  ): Promise<boolean>;

  /**
   * Remove webhook integration.
   * @see https://core.telegram.org/bots/api#deletewebhook
   */
  deleteWebHook(form?: { drop_pending_updates?: boolean }): Promise<boolean>;

  /**
   * Get current webhook status.
   * @see https://core.telegram.org/bots/api#getwebhookinfo
   */
  getWebHookInfo(form?: FormQueryOptions): Promise<{
    url: string;
    has_custom_certificate: boolean;
    pending_update_count: Integer;
    ip_address?: string;
    last_error_date?: Integer;
    last_error_message?: string;
    last_synchronization_error_date?: Integer;
    max_connections?: Integer;
    allowed_updates?: string[];
  }>;

  // --- Basic Info -------------------------------------------------------------

  /** A simple method for testing your bot's authentication token. */
  getMe(form?: FormQueryOptions): Promise<User>;

  /** Log out from the cloud Bot API server. */
  logOut(form?: FormQueryOptions): Promise<boolean>;

  /** Close the bot instance before moving it from one local server to another. */
  close(form?: FormQueryOptions): Promise<boolean>;

  // --- Sending Messages -------------------------------------------------------

  /**
   * Send text message.
   * @see https://core.telegram.org/bots/api#sendmessage
   */
  sendMessage(
    chatId: number | string,
    text: string,
    form?: SendMessageOptions,
  ): Promise<Message>;

  /**
   * Forward messages of any kind.
   * @see https://core.telegram.org/bots/api#forwardmessage
   */
  forwardMessage(
    chatId: number | string,
    fromChatId: number | string,
    messageId: number,
    form?: {
      disable_notification?: boolean;
      protect_content?: boolean;
      message_effect_id?: string;
    },
  ): Promise<Message>;

  /**
   * Forward multiple messages of any kind.
   * @see https://core.telegram.org/bots/api#forwardmessages
   */
  forwardMessages(
    chatId: number | string,
    fromChatId: number | string,
    messageIds: number[],
    form?: {
      disable_notification?: boolean;
      protect_content?: boolean;
    },
  ): Promise<MessageId[]>;

  /**
   * Copy messages of any kind.
   * @see https://core.telegram.org/bots/api#copymessage
   */
  copyMessage(
    chatId: number | string,
    fromChatId: number | string,
    messageId: number,
    form?: {
      message_thread_id?: Integer;
      caption?: string;
      parse_mode?: string;
      caption_entities?: MessageEntity[];
      show_caption_above_media?: boolean;
      disable_notification?: boolean;
      protect_content?: boolean;
      allow_paid_broadcast?: boolean;
      reply_parameters?: ReplyParameters;
      reply_markup?: ReplyMarkup;
    },
  ): Promise<{ message_id: Integer }>;

  /**
   * Copy messages of any kind.
   * @see https://core.telegram.org/bots/api#copymessages
   */
  copyMessages(
    chatId: number | string,
    fromChatId: number | string,
    messageIds: number[],
    form?: {
      message_thread_id?: Integer;
      disable_notification?: boolean;
      protect_content?: boolean;
      remove_caption?: boolean;
    },
  ): Promise<{ message_id: Integer }[]>;

  /**
   * Send photo.
   * @see https://core.telegram.org/bots/api#sendphoto
   */
  sendPhoto(
    chatId: number | string,
    photo: InputFile,
    options?: SendPhotoOptions,
    fileOptions?: FormQueryOptions,
  ): Promise<Message>;

  /**
   * Send audio.
   * @see https://core.telegram.org/bots/api#sendaudio
   */
  sendAudio(
    chatId: number | string,
    audio: InputFile,
    options?: SendAudioOptions,
    fileOptions?: FormQueryOptions,
  ): Promise<Message>;

  /**
   * Send document.
   * @see https://core.telegram.org/bots/api#senddocument
   */
  sendDocument(
    chatId: number | string,
    doc: InputFile,
    options?: SendDocumentOptions,
    fileOptions?: FormQueryOptions,
  ): Promise<Message>;

  /**
   * Send video.
   * @see https://core.telegram.org/bots/api#sendvideo
   */
  sendVideo(
    chatId: number | string,
    video: InputFile,
    options?: SendVideoOptions,
    fileOptions?: FormQueryOptions,
  ): Promise<Message>;

  /**
   * Send animation (GIF or H.264/MPEG-4 AVC video without sound).
   * @see https://core.telegram.org/bots/api#sendanimation
   */
  sendAnimation(
    chatId: number | string,
    animation: InputFile,
    options?: SendAnimationOptions,
    fileOptions?: FormQueryOptions,
  ): Promise<Message>;

  /**
   * Send voice message.
   * @see https://core.telegram.org/bots/api#sendvoice
   */
  sendVoice(
    chatId: number | string,
    voice: InputFile,
    options?: SendVoiceOptions,
    fileOptions?: FormQueryOptions,
  ): Promise<Message>;

  /**
   * Send video note (round video).
   * @see https://core.telegram.org/bots/api#sendvideonote
   */
  sendVideoNote(
    chatId: number | string,
    videoNote: InputFile,
    options?: SendVideoNoteOptions,
    fileOptions?: FormQueryOptions,
  ): Promise<Message>;

  /**
   * Send a group of photos or videos as an album.
   * @see https://core.telegram.org/bots/api#sendmediagroup
   */
  sendMediaGroup(
    chatId: number | string,
    media: Array<InputMedia & { file_options?: FormQueryOptions }>,
    options?: FormQueryOptions,
  ): Promise<Message[]>;

  /**
   * Send paid media.
   * @see https://core.telegram.org/bots/api#sendpaidmedia
   */
  sendPaidMedia(
    chatId: number | string,
    starCount: Integer,
    media: InputPaidMedia[],
    options?: SendPaidMediaOptions,
  ): Promise<Message>;

  /**
   * Send location.
   * @see https://core.telegram.org/bots/api#sendlocation
   */
  sendLocation(
    chatId: number | string,
    latitude: Float,
    longitude: Float,
    options?: SendLocationOptions,
  ): Promise<Message>;

  /**
   * Edit live location messages sent by the bot.
   * @see https://core.telegram.org/bots/api#editmessagelivelocation
   */
  editMessageLiveLocation(
    latitude: Float,
    longitude: Float,
    form?: {
      chat_id?: number | string;
      message_id?: number;
      inline_message_id?: string;
      horizontal_accuracy?: Float;
      heading?: Integer;
      proximity_alert_radius?: Integer;
      reply_markup?: InlineKeyboardMarkup;
    },
  ): Promise<Message | boolean>;

  /**
   * Stop updating a live location message.
   * @see https://core.telegram.org/bots/api#stopmessagelivelocation
   */
  stopMessageLiveLocation(form?: {
    chat_id?: number | string;
    message_id?: number;
    inline_message_id?: string;
    reply_markup?: InlineKeyboardMarkup;
  }): Promise<Message | boolean>;

  /**
   * Send venue.
   * @see https://core.telegram.org/bots/api#sendvenue
   */
  sendVenue(
    chatId: number | string,
    latitude: Float,
    longitude: Float,
    title: string,
    address: string,
    options?: SendVenueOptions,
  ): Promise<Message>;

  /**
   * Send contact.
   * @see https://core.telegram.org/bots/api#sendcontact
   */
  sendContact(
    chatId: number | string,
    phoneNumber: string,
    firstName: string,
    options?: SendContactOptions,
  ): Promise<Message>;

  /**
   * Send poll.
   * @see https://core.telegram.org/bots/api#sendpoll
   */
  sendPoll(
    chatId: number | string,
    question: string,
    pollOptions: string[] | Array<{ text: string }>,
    options?: SendPollOptions,
  ): Promise<Message>;

  /**
   * Send animated emoji that will display a random value.
   * @see https://core.telegram.org/bots/api#senddice
   */
  sendDice(
    chatId: number | string,
    options?: SendDiceOptions,
  ): Promise<Message>;

  /**
   * Send chat action.
   * @see https://core.telegram.org/bots/api#sendchataction
   */
  sendChatAction(
    chatId: number | string,
    action: string,
    form?: SendChatActionOptions,
  ): Promise<boolean>;

  /**
   * Change the chosen reactions on a message.
   * @see https://core.telegram.org/bots/api#setmessagereaction
   */
  setMessageReaction(
    chatId: number | string,
    messageId: number,
    form?: {
      reaction?: ReactionType[];
      is_big?: boolean;
    },
  ): Promise<boolean>;

  // --- User Info --------------------------------------------------------------

  /**
   * Get a list of profile pictures for a user.
   * @see https://core.telegram.org/bots/api#getuserprofilephotos
   */
  getUserProfilePhotos(
    userId: number,
    form?: { offset?: Integer; limit?: Integer },
  ): Promise<UserProfilePhotos>;

  // --- Files ------------------------------------------------------------------

  /**
   * Get basic info about a file and prepare it for downloading.
   * @see https://core.telegram.org/bots/api#getfile
   */
  getFile(fileId: string, form?: FormQueryOptions): Promise<File>;

  // --- Chat Management --------------------------------------------------------

  /**
   * Ban a user in a group, supergroup or channel.
   * @see https://core.telegram.org/bots/api#banchatmember
   */
  banChatMember(
    chatId: number | string,
    userId: number,
    form?: { until_date?: Integer; revoke_messages?: boolean },
  ): Promise<boolean>;

  /**
   * Unban a previously kicked user in a supergroup.
   * @see https://core.telegram.org/bots/api#unbanchatmember
   */
  unbanChatMember(
    chatId: number | string,
    userId: number,
    form?: { only_if_banned?: boolean },
  ): Promise<boolean>;

  /**
   * Restrict a user in a supergroup.
   * @see https://core.telegram.org/bots/api#restrictchatmember
   */
  restrictChatMember(
    chatId: number | string,
    userId: number,
    form?: { permissions: ChatPermissions; use_independent_chat_permissions?: boolean; until_date?: Integer },
  ): Promise<boolean>;

  /**
   * Promote or demote a user in a supergroup or channel.
   * @see https://core.telegram.org/bots/api#promotechatmember
   */
  promoteChatMember(
    chatId: number | string,
    userId: number,
    form?: {
      is_anonymous?: boolean;
      can_manage_chat?: boolean;
      can_delete_messages?: boolean;
      can_manage_video_chats?: boolean;
      can_restrict_members?: boolean;
      can_promote_members?: boolean;
      can_change_info?: boolean;
      can_invite_users?: boolean;
      can_post_messages?: boolean;
      can_edit_messages?: boolean;
      can_pin_messages?: boolean;
      can_manage_topics?: boolean;
      can_post_stories?: boolean;
      can_edit_stories?: boolean;
      can_delete_stories?: boolean;
      can_manage_direct_messages?: boolean;
    },
  ): Promise<boolean>;

  /**
   * Set a custom title for an administrator in a supergroup.
   * @see https://core.telegram.org/bots/api#setchatadministratorcustomtitle
   */
  setChatAdministratorCustomTitle(
    chatId: number | string,
    userId: number,
    customTitle: string,
    form?: FormQueryOptions,
  ): Promise<boolean>;

  /**
   * Ban a channel chat in a supergroup or channel.
   * @see https://core.telegram.org/bots/api#banchatsenderchat
   */
  banChatSenderChat(
    chatId: number | string,
    senderChatId: number,
    form?: FormQueryOptions,
  ): Promise<boolean>;

  /**
   * Unban a previously banned channel chat.
   * @see https://core.telegram.org/bots/api#unbanchatsenderchat
   */
  unbanChatSenderChat(
    chatId: number | string,
    senderChatId: number,
    form?: FormQueryOptions,
  ): Promise<boolean>;

  /**
   * Set default chat permissions for all members.
   * @see https://core.telegram.org/bots/api#setchatpermissions
   */
  setChatPermissions(
    chatId: number | string,
    chatPermissions: ChatPermissions,
    form?: { use_independent_chat_permissions?: boolean },
  ): Promise<boolean>;

  /**
   * Generate a new primary invite link for a chat.
   * @see https://core.telegram.org/bots/api#exportchatinvitelink
   */
  exportChatInviteLink(chatId: number | string, form?: FormQueryOptions): Promise<string>;

  /**
   * Create an additional invite link for a chat.
   * @see https://core.telegram.org/bots/api#createchatinvitelink
   */
  createChatInviteLink(
    chatId: number | string,
    form?: {
      name?: string;
      expire_date?: Integer;
      member_limit?: Integer;
      creates_join_request?: boolean;
    },
  ): Promise<ChatInviteLink>;

  /**
   * Edit a non-primary invite link created by the bot.
   * @see https://core.telegram.org/bots/api#editchatinvitelink
   */
  editChatInviteLink(
    chatId: number | string,
    inviteLink: string,
    form?: {
      name?: string;
      expire_date?: Integer;
      member_limit?: Integer;
      creates_join_request?: boolean;
    },
  ): Promise<ChatInviteLink>;

  /**
   * Revoke an invite link created by the bot.
   * @see https://core.telegram.org/bots/api#revokechatinvitelink
   */
  revokeChatInviteLink(chatId: number | string, inviteLink: string, form?: FormQueryOptions): Promise<ChatInviteLink>;

  /**
   * Approve a chat join request.
   * @see https://core.telegram.org/bots/api#approvechatjoinrequest
   */
  approveChatJoinRequest(chatId: number | string, userId: number, form?: FormQueryOptions): Promise<boolean>;

  /**
   * Decline a chat join request.
   * @see https://core.telegram.org/bots/api#declinechatjoinrequest
   */
  declineChatJoinRequest(chatId: number | string, userId: number, form?: FormQueryOptions): Promise<boolean>;

  /**
   * Set a new profile photo for the chat.
   * @see https://core.telegram.org/bots/api#setchatphoto
   */
  setChatPhoto(
    chatId: number | string,
    photo: InputFile,
    options?: FormQueryOptions,
    fileOptions?: FormQueryOptions,
  ): Promise<boolean>;

  /**
   * Delete a chat photo.
   * @see https://core.telegram.org/bots/api#deletechatphoto
   */
  deleteChatPhoto(chatId: number | string, form?: FormQueryOptions): Promise<boolean>;

  /**
   * Change the title of a chat.
   * @see https://core.telegram.org/bots/api#setchattitle
   */
  setChatTitle(chatId: number | string, title: string, form?: FormQueryOptions): Promise<boolean>;

  /**
   * Change the description of a group, supergroup or channel.
   * @see https://core.telegram.org/bots/api#setchatdescription
   */
  setChatDescription(chatId: number | string, description: string, form?: FormQueryOptions): Promise<boolean>;

  /**
   * Pin a message in a supergroup.
   * @see https://core.telegram.org/bots/api#pinchatmessage
   */
  pinChatMessage(
    chatId: number | string,
    messageId: number,
    form?: { disable_notification?: boolean; business_connection_id?: string },
  ): Promise<boolean>;

  /**
   * Remove a message from the list of pinned messages in a chat.
   * @see https://core.telegram.org/bots/api#unpinchatmessage
   */
  unpinChatMessage(
    chatId: number | string,
    form?: { message_id?: Integer; business_connection_id?: string },
  ): Promise<boolean>;

  /**
   * Clear the list of pinned messages in a chat.
   * @see https://core.telegram.org/bots/api#unpinallchatmessages
   */
  unpinAllChatMessages(chatId: number | string, form?: FormQueryOptions): Promise<boolean>;

  /**
   * Leave a group, supergroup or channel.
   * @see https://core.telegram.org/bots/api#leavechat
   */
  leaveChat(chatId: number | string, form?: FormQueryOptions): Promise<boolean>;

  /**
   * Get up to date information about the chat.
   * @see https://core.telegram.org/bots/api#getchat
   */
  getChat(chatId: number | string, form?: FormQueryOptions): Promise<ChatFullInfo>;

  /**
   * Get a list of administrators in a chat.
   * @see https://core.telegram.org/bots/api#getchatadministrators
   */
  getChatAdministrators(chatId: number | string, form?: FormQueryOptions): Promise<ChatMember[]>;

  /**
   * Get the number of members in a chat.
   * @see https://core.telegram.org/bots/api#getchatmembercount
   */
  getChatMemberCount(chatId: number | string, form?: FormQueryOptions): Promise<Integer>;

  /**
   * Get information about a member of a chat.
   * @see https://core.telegram.org/bots/api#getchatmember
   */
  getChatMember(chatId: number | string, userId: number, form?: FormQueryOptions): Promise<ChatMember>;

  /**
   * Set a new group sticker set for a supergroup.
   * @see https://core.telegram.org/bots/api#setchatstickerset
   */
  setChatStickerSet(chatId: number | string, stickerSetName: string, form?: FormQueryOptions): Promise<boolean>;

  /**
   * Delete a group sticker set from a supergroup.
   * @see https://core.telegram.org/bots/api#deletechatstickerset
   */
  deleteChatStickerSet(chatId: number | string, form?: FormQueryOptions): Promise<boolean>;

  // --- Forum Topics ------------------------------------------------------------

  /**
   * Get custom emoji stickers for forum topic icons.
   * @see https://core.telegram.org/bots/api#getforumtopiciconstickers
   */
  getForumTopicIconStickers(chatId?: number | string, form?: FormQueryOptions): Promise<Sticker[]>;

  /**
   * Create a topic in a forum supergroup chat.
   * @see https://core.telegram.org/bots/api#createforumtopic
   */
  createForumTopic(
    chatId: number | string,
    name: string,
    form?: { icon_color?: Integer; icon_custom_emoji_id?: string },
  ): Promise<ForumTopic>;

  /**
   * Edit name and icon of a topic in a forum supergroup chat.
   * @see https://core.telegram.org/bots/api#editforumtopic
   */
  editForumTopic(
    chatId: number | string,
    messageThreadId: number,
    form?: { name?: string; icon_custom_emoji_id?: string },
  ): Promise<boolean>;

  /**
   * Close an open topic in a forum supergroup chat.
   * @see https://core.telegram.org/bots/api#closeforumtopic
   */
  closeForumTopic(chatId: number | string, messageThreadId: number, form?: FormQueryOptions): Promise<boolean>;

  /**
   * Reopen a closed topic in a forum supergroup chat.
   * @see https://core.telegram.org/bots/api#reopenforumtopic
   */
  reopenForumTopic(chatId: number | string, messageThreadId: number, form?: FormQueryOptions): Promise<boolean>;

  /**
   * Delete a forum topic along with all its messages.
   * @see https://core.telegram.org/bots/api#deleteforumtopic
   */
  deleteForumTopic(chatId: number | string, messageThreadId: number, form?: FormQueryOptions): Promise<boolean>;

  /**
   * Clear the list of pinned messages in a forum topic.
   * @see https://core.telegram.org/bots/api#unpinallforumtopicmessages
   */
  unpinAllForumTopicMessages(chatId: number | string, messageThreadId: number, form?: FormQueryOptions): Promise<boolean>;

  /**
   * Edit the name of the 'General' topic in a forum supergroup chat.
   * @see https://core.telegram.org/bots/api#editgeneralforumtopic
   */
  editGeneralForumTopic(chatId: number | string, name: string, form?: FormQueryOptions): Promise<boolean>;

  /**
   * Close an open 'General' topic in a forum supergroup chat.
   * @see https://core.telegram.org/bots/api#closegeneralforumtopic
   */
  closeGeneralForumTopic(chatId: number | string, form?: FormQueryOptions): Promise<boolean>;

  /**
   * Reopen a closed 'General' topic in a forum supergroup chat.
   * @see https://core.telegram.org/bots/api#reopengeneralforumtopic
   */
  reopenGeneralForumTopic(chatId: number | string, form?: FormQueryOptions): Promise<boolean>;

  /**
   * Hide the 'General' topic in a forum supergroup chat.
   * @see https://core.telegram.org/bots/api#hidegeneralforumtopic
   */
  hideGeneralForumTopic(chatId: number | string, form?: FormQueryOptions): Promise<boolean>;

  /**
   * Unhide the 'General' topic in a forum supergroup chat.
   * @see https://core.telegram.org/bots/api#unhidegeneralforumtopic
   */
  unhideGeneralForumTopic(chatId: number | string, form?: FormQueryOptions): Promise<boolean>;

  /**
   * Clear the list of pinned messages in a General forum topic.
   * @see https://core.telegram.org/bots/api#unpinallgeneralforumtopicmessages
   */
  unpinAllGeneralForumTopicMessages(chatId: number | string, form?: FormQueryOptions): Promise<boolean>;

  // --- Callback Queries -------------------------------------------------------

  /**
   * Send answers to callback queries.
   * @see https://core.telegram.org/bots/api#answercallbackquery
   */
  answerCallbackQuery(
    callbackQueryId: string,
    form?: { text?: string; show_alert?: boolean; url?: string; cache_time?: Integer },
  ): Promise<boolean>;

  /**
   * Get the list of boosts added to a chat by a user.
   * @see https://core.telegram.org/bots/api#getuserchatboosts
   */
  getUserChatBoosts(chatId: number | string, userId: number, form?: FormQueryOptions): Promise<UserChatBoosts>;

  /**
   * Get information about the connection of the bot with a business account.
   * @see https://core.telegram.org/bots/api#getbusinessconnection
   */
  getBusinessConnection(businessConnectionId: string, form?: FormQueryOptions): Promise<BusinessConnection>;

  // --- Bot Commands -----------------------------------------------------------

  /**
   * Change the list of the bot's commands.
   * @see https://core.telegram.org/bots/api#setmycommands
   */
  setMyCommands(
    commands: Array<{ command: string; description: string }>,
    form?: {
      scope?: BotCommandScope;
      language_code?: string;
    },
  ): Promise<boolean>;

  /**
   * Delete the list of the bot's commands for the given scope and user language.
   * @see https://core.telegram.org/bots/api#deletemycommands
   */
  deleteMyCommands(form?: {
    scope?: BotCommandScope;
    language_code?: string;
  }): Promise<boolean>;

  /**
   * Get the current list of the bot's commands for the given scope and user language.
   * @see https://core.telegram.org/bots/api#getmycommands
   */
  getMyCommands(form?: {
    scope?: BotCommandScope;
    language_code?: string;
  }): Promise<Array<{ command: string; description: string }>>;

  /**
   * Change the bot's name.
   * @see https://core.telegram.org/bots/api#setmyname
   */
  setMyName(form?: { name?: string; language_code?: string }): Promise<boolean>;

  /**
   * Get the current bot name for the given user language.
   * @see https://core.telegram.org/bots/api#getmyname
   */
  getMyName(form?: { language_code?: string }): Promise<{ name: string }>;

  /**
   * Change the bot's description.
   * @see https://core.telegram.org/bots/api#setmydescription
   */
  setMyDescription(form?: { description?: string; language_code?: string }): Promise<boolean>;

  /**
   * Get the current bot description for the given user language.
   * @see https://core.telegram.org/bots/api#getmydescription
   */
  getMyDescription(form?: { language_code?: string }): Promise<{ description: string }>;

  /**
   * Change the bot's short description.
   * @see https://core.telegram.org/bots/api#setmyshortdescription
   */
  setMyShortDescription(form?: { short_description?: string; language_code?: string }): Promise<boolean>;

  /**
   * Get the current bot short description for the given user language.
   * @see https://core.telegram.org/bots/api#getmyshortdescription
   */
  getMyShortDescription(form?: { language_code?: string }): Promise<{ short_description: string }>;

  // --- Menu Button / Admin Rights ---------------------------------------------

  /**
   * Change the bot's menu button in a private chat, or the default menu button.
   * @see https://core.telegram.org/bots/api#setchatmenubutton
   */
  setChatMenuButton(form?: { chat_id?: number | string; menu_button?: MenuButton }): Promise<boolean>;

  /**
   * Get the current value of the bot's menu button in a private chat, or the default menu button.
   * @see https://core.telegram.org/bots/api#getchatmenubutton
   */
  getChatMenuButton(form?: { chat_id?: number | string }): Promise<MenuButton>;

  /**
   * Change the default administrator rights requested by the bot when it's added as an administrator.
   * @see https://core.telegram.org/bots/api#setmydefaultadministratorrights
   */
  setMyDefaultAdministratorRights(form?: {
    rights?: ChatAdministratorRights;
    for_channels?: boolean;
  }): Promise<boolean>;

  /**
   * Get the current default administrator rights of the bot.
   * @see https://core.telegram.org/bots/api#getmydefaultadministratorrights
   */
  getMyDefaultAdministratorRights(form?: { for_channels?: boolean }): Promise<ChatAdministratorRights>;

  // --- Editing Messages -------------------------------------------------------

  /**
   * Edit text or game messages sent by the bot or via the bot.
   * @see https://core.telegram.org/bots/api#editmessagetext
   */
  editMessageText(
    text: string,
    form?: {
      chat_id?: number | string;
      message_id?: number;
      inline_message_id?: string;
      parse_mode?: string;
      entities?: MessageEntity[];
      link_preview_options?: LinkPreviewOptions;
      reply_markup?: InlineKeyboardMarkup;
    },
  ): Promise<Message | boolean>;

  /**
   * Edit captions of messages sent by the bot or via the bot.
   * @see https://core.telegram.org/bots/api#editmessagecaption
   */
  editMessageCaption(
    caption: string | undefined,
    form?: {
      chat_id?: number | string;
      message_id?: number;
      inline_message_id?: string;
      parse_mode?: string;
      caption_entities?: MessageEntity[];
      show_caption_above_media?: boolean;
      reply_markup?: InlineKeyboardMarkup;
    },
  ): Promise<Message | boolean>;

  /**
   * Edit animation, audio, document, photo, or video messages.
   * @see https://core.telegram.org/bots/api#editmessagemedia
   */
  editMessageMedia(
    media: InputMedia,
    form?: {
      chat_id?: number | string;
      message_id?: number;
      inline_message_id?: string;
      reply_markup?: InlineKeyboardMarkup;
    },
  ): Promise<Message | boolean>;

  /**
   * Edit only the reply markup of messages sent by the bot.
   * @see https://core.telegram.org/bots/api#editmessagereplymarkup
   */
  editMessageReplyMarkup(
    replyMarkup: InlineKeyboardMarkup | undefined,
    form?: {
      chat_id?: number | string;
      message_id?: number;
      inline_message_id?: string;
    },
  ): Promise<Message | boolean>;

  /**
   * Stop a poll which was sent by the bot.
   * @see https://core.telegram.org/bots/api#stoppoll
   */
  stopPoll(
    chatId: number | string,
    pollId: number,
    form?: {
      message_thread_id?: Integer;
      reply_markup?: InlineKeyboardMarkup;
    },
  ): Promise<Poll>;

  // --- Stickers ----------------------------------------------------------------

  /**
   * Send static, animated, or video stickers.
   * @see https://core.telegram.org/bots/api#sendsticker
   */
  sendSticker(
    chatId: number | string,
    sticker: InputFile,
    options?: SendStickerOptions,
    fileOptions?: FormQueryOptions,
  ): Promise<Message>;

  /**
   * Get a sticker set.
   * @see https://core.telegram.org/bots/api#getstickerset
   */
  getStickerSet(name: string, form?: FormQueryOptions): Promise<StickerSet>;

  /**
   * Get information about custom emoji stickers by their identifiers.
   * @see https://core.telegram.org/bots/api#getcustomemojistickers
   */
  getCustomEmojiStickers(customEmojiIds: string[], form?: FormQueryOptions): Promise<Sticker[]>;

  /**
   * Upload a file with a sticker for later use in createNewStickerSet and addStickerToSet.
   * @see https://core.telegram.org/bots/api#uploadstickerfile
   */
  uploadStickerFile(
    userId: number,
    sticker: InputFile,
    stickerFormat?: string,
    options?: FormQueryOptions,
    fileOptions?: FormQueryOptions,
  ): Promise<File>;

  /**
   * Create new sticker set owned by a user.
   * @see https://core.telegram.org/bots/api#createnewstickerset
   */
  createNewStickerSet(
    userId: number,
    name: string,
    title: string,
    pngSticker: InputFile,
    emojis: string,
    options?: {
      sticker_type?: string;
      needs_repainting?: boolean;
      mask_position?: MaskPosition;
    },
    fileOptions?: FormQueryOptions,
  ): Promise<boolean>;

  /**
   * Add a new sticker to a set created by the bot.
   * @see https://core.telegram.org/bots/api#addstickertoset
   */
  addStickerToSet(
    userId: number,
    name: string,
    sticker: InputFile,
    emojis: string,
    stickerType?: string,
    options?: {
      mask_position?: MaskPosition;
    },
    fileOptions?: FormQueryOptions,
  ): Promise<boolean>;

  /**
   * Move a sticker in a set to a specific position.
   * @see https://core.telegram.org/bots/api#setstickerpositioninset
   */
  setStickerPositionInSet(sticker: string, position: Integer, form?: FormQueryOptions): Promise<boolean>;

  /**
   * Delete a sticker from a set created by the bot.
   * @see https://core.telegram.org/bots/api#deletestickerfromset
   */
  deleteStickerFromSet(sticker: string, form?: FormQueryOptions): Promise<boolean>;

  /**
   * Replace an existing sticker in a sticker set with a new one.
   * @see https://core.telegram.org/bots/api#replacestickerinset
   */
  replaceStickerInSet(userId: number, name: string, oldSticker: string, form?: FormQueryOptions): Promise<boolean>;

  /**
   * Change the list of emoji assigned to a regular or custom emoji sticker.
   * @see https://core.telegram.org/bots/api#setstickeremojilist
   */
  setStickerEmojiList(sticker: string, emojiList: string[], form?: FormQueryOptions): Promise<boolean>;

  /**
   * Change the keywords of a regular or custom emoji sticker.
   * @see https://core.telegram.org/bots/api#setstickerkeywords
   */
  setStickerKeywords(sticker: string, form?: { keywords?: string[] }): Promise<boolean>;

  /**
   * Change the mask position of a mask sticker.
   * @see https://core.telegram.org/bots/api#setstickermaskposition
   */
  setStickerMaskPosition(sticker: string, form?: { mask_position?: MaskPosition }): Promise<boolean>;

  /**
   * Set the title of a created sticker set.
   * @see https://core.telegram.org/bots/api#setstickersettitle
   */
  setStickerSetTitle(name: string, title: string, form?: FormQueryOptions): Promise<boolean>;

  /**
   * Set the thumbnail of a sticker set.
   * @see https://core.telegram.org/bots/api#setstickersetthumbnail
   */
  setStickerSetThumbnail(
    userId: number,
    name: string,
    thumbnail: InputFile | null,
    options?: { format: string },
    fileOptions?: FormQueryOptions,
  ): Promise<boolean>;

  /**
   * Set the thumbnail of a custom emoji sticker set.
   * @see https://core.telegram.org/bots/api#setcustomemojistickersetthumbnail
   */
  setCustomEmojiStickerSetThumbnail(name: string, form?: { custom_emoji_id?: string }): Promise<boolean>;

  /**
   * Delete a sticker set that was created by the bot.
   * @see https://core.telegram.org/bots/api#deletestickerset
   */
  deleteStickerSet(name: string, form?: FormQueryOptions): Promise<boolean>;

  // --- Inline Mode ------------------------------------------------------------

  /**
   * Send answers to an inline query.
   * @see https://core.telegram.org/bots/api#answerinlinequery
   */
  answerInlineQuery(
    inlineQueryId: string,
    results: InlineQueryResult[],
    form?: {
      cache_time?: Integer;
      is_personal?: boolean;
      next_offset?: string;
      button?: InlineQueryResultsButton;
    },
  ): Promise<boolean>;

  /**
   * Set the result of an interaction with a Web App.
   * @see https://core.telegram.org/bots/api#answerwebappquery
   */
  answerWebAppQuery(
    webAppQueryId: string,
    result: InlineQueryResult,
    form?: FormQueryOptions,
  ): Promise<SentWebAppMessage>;

  // --- Payments ----------------------------------------------------------------

  /**
   * Send an invoice.
   * @see https://core.telegram.org/bots/api#sendinvoice
   */
  sendInvoice(
    chatId: number | string,
    title: string,
    description: string,
    payload: string,
    providerToken: string,
    currency: string,
    prices: LabeledPrice[],
    form?: SendInvoiceOptions,
  ): Promise<Message>;

  /**
   * Create a link for an invoice.
   * @see https://core.telegram.org/bots/api#createinvoicelink
   */
  createInvoiceLink(
    title: string,
    description: string,
    payload: string,
    providerToken: string,
    currency: string,
    prices: LabeledPrice[],
    form?: {
      max_tip_amount?: Integer;
      suggested_tip_amounts?: Integer[];
      provider_data?: string;
      photo_url?: string;
      photo_size?: Integer;
      photo_width?: Integer;
      photo_height?: Integer;
      need_name?: boolean;
      need_phone_number?: boolean;
      need_email?: boolean;
      need_shipping_address?: boolean;
      send_phone_number_to_provider?: boolean;
      send_email_to_provider?: boolean;
      is_flexible?: boolean;
      subscription_period?: Integer;
      business_connection_id?: string;
    },
  ): Promise<string>;

  /**
   * Reply to shipping queries.
   * @see https://core.telegram.org/bots/api#answershippingquery
   */
  answerShippingQuery(
    shippingQueryId: string,
    ok: boolean,
    form?: { shipping_options?: ShippingOptions; error_message?: string },
  ): Promise<boolean>;

  /**
   * Respond to pre-checkout queries.
   * @see https://core.telegram.org/bots/api#answerprecheckoutquery
   */
  answerPreCheckoutQuery(
    preCheckoutQueryId: string,
    ok: boolean,
    form?: { error_message?: string },
  ): Promise<boolean>;

  // --- Games -------------------------------------------------------------------

  /**
   * Send a game.
   * @see https://core.telegram.org/bots/api#sendgame
   */
  sendGame(
    chatId: number | string,
    gameShortName: string,
    form?: SendGameOptions,
  ): Promise<Message>;

  /**
   * Set the score of the specified user in a game message.
   * @see https://core.telegram.org/bots/api#setgamescore
   */
  setGameScore(
    userId: number,
    score: number,
    form?: {
      force?: boolean;
      disable_edit_message?: boolean;
      chat_id?: number | string;
      message_id?: number;
      inline_message_id?: string;
    },
  ): Promise<Message | boolean>;

  /**
   * Get data for high score tables.
   * @see https://core.telegram.org/bots/api#getgamehighscores
   */
  getGameHighScores(
    userId: number,
    form?: {
      chat_id?: number | string;
      message_id?: number;
      inline_message_id?: string;
    },
  ): Promise<GameHighScore[]>;

  // --- Deleting Messages ------------------------------------------------------

  /**
   * Delete a message.
   * @see https://core.telegram.org/bots/api#deletemessage
   */
  deleteMessage(chatId: number | string, messageId: number, form?: FormQueryOptions): Promise<boolean>;

  /**
   * Delete multiple messages simultaneously.
   * @see https://core.telegram.org/bots/api#deletemessages
   */
  deleteMessages(chatId: number | string, messageIds: number[], form?: FormQueryOptions): Promise<boolean>;

  // ==========================================================================
  // Bot API 7.4+: Telegram Stars
  // ==========================================================================

  /**
   * Issue a refund for a payment made via Telegram Stars.
   * @see https://core.telegram.org/bots/api#refundstarpayment
   */
  refundStarPayment(
    userId: number,
    telegramPaymentChargeId: string,
    form?: FormQueryOptions,
  ): Promise<boolean>;

  /**
   * Get the current status of the balance of Telegram Stars.
   * @see https://core.telegram.org/bots/api#getstartransactions
   */
  getStarTransactions(form?: {
    offset?: Integer;
    limit?: Integer;
  }): Promise<StarTransactions>;

  // ==========================================================================
  // Bot API 7.9+: Chat Subscription Invite Links
  // ==========================================================================

  /**
   * Create a subscription invite link for a channel chat.
   * @see https://core.telegram.org/bots/api#createchatsubscriptioninvitelink
   */
  createChatSubscriptionInviteLink(
    chatId: number | string,
    form?: {
      name?: string;
      subscription_period: Integer;
      subscription_price: Integer;
    },
  ): Promise<ChatInviteLink>;

  /**
   * Edit a subscription invite link created by the bot.
   * @see https://core.telegram.org/bots/api#editchatsubscriptioninvitelink
   */
  editChatSubscriptionInviteLink(
    chatId: number | string,
    inviteLink: string,
    form?: { name?: string },
  ): Promise<ChatInviteLink>;

  // ==========================================================================
  // Bot API 8.0+: Gifts
  // ==========================================================================

  /**
   * Get the list of gifts that can be sent by the bot.
   * @see https://core.telegram.org/bots/api#getavailablegifts
   */
  getAvailableGifts(form?: FormQueryOptions): Promise<Gifts>;

  /**
   * Send a gift to a user.
   * @see https://core.telegram.org/bots/api#sendgift
   */
  sendGift(
    userId: number,
    giftId: string,
    form?: { text?: string; text_parse_mode?: string; text_entities?: MessageEntity[]; pay_for_upgrade?: boolean },
  ): Promise<boolean>;

  /**
   * Edit a subscription paid through Telegram Stars.
   * @see https://core.telegram.org/bots/api#edituserstarsubscription
   */
  editUserStarSubscription(
    userId: number,
    telegramPaymentChargeId: string,
    isCanceled: boolean,
    form?: FormQueryOptions,
  ): Promise<boolean>;

  /**
   * Store an inline message that can be sent on behalf of a user.
   * @see https://core.telegram.org/bots/api#savepreparedinlinemessage
   */
  savePreparedInlineMessage(
    userId: number,
    result: InlineQueryResult,
    form?: { allow_user_chats?: boolean; allow_bot_chats?: boolean; allow_group_chats?: boolean; allow_channel_chats?: boolean },
  ): Promise<PreparedInlineMessage>;

  // ==========================================================================
  // Bot API 8.2+: Verification
  // ==========================================================================

  /**
   * Verify a user that is managed by the bot.
   * @see https://core.telegram.org/bots/api#verifyuser
   */
  verifyUser(userId: number, form?: { custom_description?: string }): Promise<boolean>;

  /**
   * Verify a chat that is managed by the bot.
   * @see https://core.telegram.org/bots/api#verifychat
   */
  verifyChat(chatId: number | string, form?: { custom_description?: string }): Promise<boolean>;

  /**
   * Remove verification for a user that is managed by the bot.
   * @see https://core.telegram.org/bots/api#removeuserverification
   */
  removeUserVerification(userId: number, form?: FormQueryOptions): Promise<boolean>;

  /**
   * Remove verification for a chat that is managed by the bot.
   * @see https://core.telegram.org/bots/api#removechatverification
   */
  removeChatVerification(chatId: number | string, form?: FormQueryOptions): Promise<boolean>;

  // ==========================================================================
  // Bot API 9.0: Business Accounts
  // ==========================================================================

  /**
   * Mark incoming messages as read on behalf of a business account.
   * @see https://core.telegram.org/bots/api#readbusinessmessage
   */
  readBusinessMessage(businessConnectionId: string, messageId: Integer, form?: FormQueryOptions): Promise<boolean>;

  /**
   * Delete messages on behalf of a business account.
   * @see https://core.telegram.org/bots/api#deletebusinessmessages
   */
  deleteBusinessMessages(businessConnectionId: string, messageIds: Integer[], form?: FormQueryOptions): Promise<boolean>;

  /**
   * Change the first and last name of a managed business account.
   * @see https://core.telegram.org/bots/api#setbusinessaccountname
   */
  setBusinessAccountName(businessConnectionId: string, form?: { first_name?: string; last_name?: string }): Promise<boolean>;

  /**
   * Change the username of a managed business account.
   * @see https://core.telegram.org/bots/api#setbusinessaccountusername
   */
  setBusinessAccountUsername(businessConnectionId: string, form?: { username?: string }): Promise<boolean>;

  /**
   * Change the bio of a managed business account.
   * @see https://core.telegram.org/bots/api#setbusinessaccountbio
   */
  setBusinessAccountBio(businessConnectionId: string, form?: { bio?: string }): Promise<boolean>;

  /**
   * Change the profile photo of a managed business account.
   * @see https://core.telegram.org/bots/api#setbusinessaccountprofilephoto
   */
  setBusinessAccountProfilePhoto(
    businessConnectionId: string,
    photo: InputProfilePhoto,
    form?: { is_public?: boolean },
  ): Promise<boolean>;

  /**
   * Remove the profile photo of a managed business account.
   * @see https://core.telegram.org/bots/api#removebusinessaccountprofilephoto
   */
  removeBusinessAccountProfilePhoto(businessConnectionId: string, form?: { is_public?: boolean }): Promise<boolean>;

  /**
   * Change the gift settings of a managed business account.
   * @see https://core.telegram.org/bots/api#setbusinessaccountgiftsettings
   */
  setBusinessAccountGiftSettings(
    businessConnectionId: string,
    form?: {
      accepted_gift_types?: {
        unlimited_gifts?: boolean;
        limited_gifts?: boolean;
        unique_gifts?: boolean;
        premium_subscription?: boolean;
      };
    },
  ): Promise<boolean>;

  /**
   * Get the current Star balance of a managed business account.
   * @see https://core.telegram.org/bots/api#getbusinessaccountstarbalance
   */
  getBusinessAccountStarBalance(businessConnectionId: string, form?: FormQueryOptions): Promise<StarAmount>;

  /**
   * Transfer Stars from the business account balance to the bot owner's balance.
   * @see https://core.telegram.org/bots/api#transferbusinessaccountstars
   */
  transferBusinessAccountStars(businessConnectionId: string, starCount: Integer, form?: FormQueryOptions): Promise<StarAmount>;

  /**
   * Get the list of gifts received by a managed business account.
   * @see https://core.telegram.org/bots/api#getbusinessaccountgifts
   */
  getBusinessAccountGifts(
    businessConnectionId: string,
    form?: { exclude_unsaved?: boolean; exclude_saved?: boolean; exclude_unlimited?: boolean; exclude_limited?: boolean; exclude_unique?: boolean; sort_by_price?: boolean; offset?: Integer; limit?: Integer },
  ): Promise<OwnedGift[]>;

  /**
   * Convert a given regular gift to Telegram Stars.
   * @see https://core.telegram.org/bots/api#convertgifttostars
   */
  convertGiftToStars(businessConnectionId: string, ownedGiftId: string, form?: FormQueryOptions): Promise<StarAmount>;

  /**
   * Upgrade a regular gift to a unique gift.
   * @see https://core.telegram.org/bots/api#upgradegift
   */
  upgradeGift(
    businessConnectionId: string,
    ownedGiftId: string,
    form?: { keep_original_details?: boolean; star_count?: Integer },
  ): Promise<OwnedGift>;

  /**
   * Transfer a regular gift to another user.
   * @see https://core.telegram.org/bots/api#transfergift
   */
  transferGift(
    businessConnectionId: string,
    ownedGiftId: string,
    newOwnerChatId: number | string,
    form?: { star_count?: Integer },
  ): Promise<boolean>;

  /**
   * Post a story on behalf of a managed business account.
   * @see https://core.telegram.org/bots/api#poststory
   */
  postStory(
    businessConnectionId: string,
    content: InputStoryContent,
    form?: {
      active_period?: Integer;
      caption?: string;
      parse_mode?: string;
      caption_entities?: MessageEntity[];
      areas?: InputStoryArea[];
      post_to_chat_page?: boolean;
      protect_content?: boolean;
    },
  ): Promise<Story>;

  /**
   * Edit a story previously posted on behalf of a managed business account.
   * @see https://core.telegram.org/bots/api#editstory
   */
  editStory(
    businessConnectionId: string,
    storyId: Integer,
    form?: {
      content?: InputStoryContent;
      caption?: string;
      parse_mode?: string;
      caption_entities?: MessageEntity[];
      areas?: InputStoryArea[];
    },
  ): Promise<Story>;

  /**
   * Delete a story previously posted on behalf of a managed business account.
   * @see https://core.telegram.org/bots/api#deletestory
   */
  deleteStory(businessConnectionId: string, storyId: Integer, form?: FormQueryOptions): Promise<boolean>;

  /**
   * Gift a Telegram Premium subscription to a user.
   * @see https://core.telegram.org/bots/api#giftpremiumsubscription
   */
  giftPremiumSubscription(
    userId: number,
    monthCount: Integer,
    starCount: Integer,
    form?: { text?: string; text_parse_mode?: string; text_entities?: MessageEntity[] },
  ): Promise<Gift>;

  /**
   * Set the emoji status of a user.
   * @see https://core.telegram.org/bots/api#setuseremojistatus
   */
  setUserEmojiStatus(
    userId: number,
    form?: { emoji_status_custom_emoji_id?: string; emoji_status_expiration_date?: Integer },
  ): Promise<boolean>;

  // ==========================================================================
  // Bot API 9.1: Checklists
  // ==========================================================================

  /**
   * Send a checklist on behalf of a managed business account.
   * @see https://core.telegram.org/bots/api#sendchecklist
   */
  sendChecklist(
    businessConnectionId: string,
    title: string,
    tasks: InputChecklistTask[],
    form?: {
      others_can_add_tasks?: boolean;
      others_can_mark_tasks_as_done?: boolean;
      business_connection_id?: string;
      message_thread_id?: Integer;
      disable_notification?: boolean;
      protect_content?: boolean;
      reply_parameters?: ReplyParameters;
      reply_markup?: InlineKeyboardMarkup;
    },
  ): Promise<Message>;

  /**
   * Edit a checklist message on behalf of a managed business account.
   * @see https://core.telegram.org/bots/api#editmessagechecklist
   */
  editMessageChecklist(
    businessConnectionId: string,
    messageId: Integer,
    form?: {
      title?: string;
      tasks?: InputChecklistTask[];
      others_can_add_tasks?: boolean;
      others_can_mark_tasks_as_done?: boolean;
      reply_markup?: InlineKeyboardMarkup;
    },
  ): Promise<Message>;

  /**
   * Get the current number of Telegram Stars owned by the bot.
   * @see https://core.telegram.org/bots/api#getmystarbalance
   */
  getMyStarBalance(form?: FormQueryOptions): Promise<StarAmount>;

  // ==========================================================================
  // Bot API 9.2: Suggested Posts
  // ==========================================================================

  /**
   * Approve a suggested post in a channel chat.
   * @see https://core.telegram.org/bots/api#approvesuggestedpost
   */
  approveSuggestedPost(businessConnectionId: string, messageId: Integer, form?: { schedule_date?: Integer }): Promise<boolean>;

  /**
   * Decline a suggested post in a channel chat.
   * @see https://core.telegram.org/bots/api#declinesuggestedpost
   */
  declineSuggestedPost(businessConnectionId: string, messageId: Integer, form?: FormQueryOptions): Promise<boolean>;

  // ==========================================================================
  // Bot API 9.3: Draft Messages, Gifts, Stories
  // ==========================================================================

  /**
   * Send a draft message to the bot's user in private chat.
   * @see https://core.telegram.org/bots/api#sendmessagedraft
   */
  sendMessageDraft(
    chatId: number | string,
    text: string,
    form?: {
      parse_mode?: string;
      entities?: MessageEntity[];
      link_preview_options?: LinkPreviewOptions;
    },
  ): Promise<Message>;

  /**
   * Get gifts received by a user in a private chat.
   * @see https://core.telegram.org/bots/api#getusergifts
   */
  getUserGifts(
    userId: number,
    form?: {
      exclude_unsaved?: boolean;
      exclude_saved?: boolean;
      exclude_unlimited?: boolean;
      exclude_limited?: boolean;
      exclude_unique?: boolean;
      sort_by_price?: boolean;
      offset?: string;
      limit?: Integer;
    },
  ): Promise<OwnedGift[]>;

  /**
   * Get gifts received by a chat.
   * @see https://core.telegram.org/bots/api#getchatgifts
   */
  getChatGifts(
    chatId: number | string,
    form?: {
      exclude_unsaved?: boolean;
      exclude_saved?: boolean;
      exclude_unlimited?: boolean;
      exclude_limited?: boolean;
      exclude_unique?: boolean;
      sort_by_price?: boolean;
      offset?: string;
      limit?: Integer;
    },
  ): Promise<OwnedGift[]>;

  /**
   * Repost a story on behalf of a managed business account.
   * @see https://core.telegram.org/bots/api#repoststory
   */
  repostStory(
    businessConnectionId: string,
    storyId: Integer,
    targetBusinessConnectionIds: Array<number | string>,
    form?: FormQueryOptions,
  ): Promise<Story[]>;

  // ==========================================================================
  // Bot API 9.4: Profile Photos, Audio Stories
  // ==========================================================================

  /**
   * Set the profile photo of the bot.
   * @see https://core.telegram.org/bots/api#setmyprofilephoto
   */
  setMyProfilePhoto(photo: InputProfilePhoto, form?: { is_public?: boolean }): Promise<boolean>;

  /**
   * Remove the profile photo of the bot.
   * @see https://core.telegram.org/bots/api#removemyprofilephoto
   */
  removeMyProfilePhoto(form?: { is_public?: boolean }): Promise<boolean>;

  /**
   * Get the profile audios of a user.
   * @see https://core.telegram.org/bots/api#getuserprofileaudios
   */
  getUserProfileAudios(
    userId: number,
    form?: { offset?: string; limit?: Integer },
  ): Promise<Audio[]>;

  // ==========================================================================
  // Bot API 9.5: Chat Member Tags
  // ==========================================================================

  /**
   * Set the tag that is applied to a specific user in a specific group chat.
   * @see https://core.telegram.org/bots/api#setchatmembertag
   */
  setChatMemberTag(chatId: number | string, userId: number, form?: { tag?: string }): Promise<boolean>;

  // ==========================================================================
  // Bot API 9.6: Managed Bot Tokens
  // ==========================================================================

  /**
   * Get the current manageable bot token for the bot.
   * @see https://core.telegram.org/bots/api#getmanagedbottoken
   */
  getManagedBotToken(botId: Integer, form?: FormQueryOptions): Promise<ManagedBotToken>;

  /**
   * Replace the manageable bot token for the bot with a new one.
   * @see https://core.telegram.org/bots/api#replacemanagedbottoken
   */
  replaceManagedBotToken(botId: Integer, form?: FormQueryOptions): Promise<ManagedBotToken>;

  /**
   * Save a prepared keyboard button for later use.
   * @see https://core.telegram.org/bots/api#savepreparedkeyboardbutton
   */
  savePreparedKeyboardButton(button: KeyboardButton, form?: FormQueryOptions): Promise<PreparedKeyboardButton>;

  // ==========================================================================
  // Bot API 10.0: Guest Mode, Live Photos, Reactions
  // ==========================================================================

  /**
   * Answer a guest query in a Telegram Web App.
   * @see https://core.telegram.org/bots/api#answerguestquery
   */
  answerGuestQuery(guestQueryId: string, text: string, form?: FormQueryOptions): Promise<boolean>;

  /**
   * Remove multiple reactions from a message.
   * @see https://core.telegram.org/bots/api#deletemessagereactions
   */
  deleteAllMessageReactions(chatId: number | string, messageId: number, form?: FormQueryOptions): Promise<boolean>;

  /**
   * Remove a reaction from a message.
   * @see https://core.telegram.org/bots/api#deletemessagereaction
   */
  deleteMessageReaction(
    chatId: number | string,
    messageId: number,
    form?: { reaction_type?: ReactionType },
  ): Promise<boolean>;

  /**
   * Send a live photo.
   * @see https://core.telegram.org/bots/api#sendlivephoto
   */
  sendLivePhoto(
    chatId: number | string,
    photo: InputFile,
    video: InputFile,
    options?: {
      business_connection_id?: string;
      message_thread_id?: Integer;
      caption?: string;
      parse_mode?: string;
      caption_entities?: MessageEntity[];
      show_caption_above_media?: boolean;
      has_spoiler?: boolean;
      disable_notification?: boolean;
      protect_content?: boolean;
      reply_parameters?: ReplyParameters;
      reply_markup?: ReplyMarkup;
    },
    fileOptions?: FormQueryOptions,
  ): Promise<Message>;

  /**
   * Get the current access settings of the bot for managed bots.
   * @see https://core.telegram.org/bots/api#getmanagedbotaccesssettings
   */
  getManagedBotAccessSettings(form?: FormQueryOptions): Promise<ManagedBotAccessSettings>;

  /**
   * Change the access settings of the bot for managed bots.
   * @see https://core.telegram.org/bots/api#setmanagedbotaccesssettings
   */
  setManagedBotAccessSettings(form?: {
    has_access_to_messages?: boolean;
    restricted_channels?: Array<number | string>;
  }): Promise<boolean>;

  /**
   * Get messages from a user's personal chat with the bot.
   * @see https://core.telegram.org/bots/api#getuserpersonalchatmessages
   */
  getUserPersonalChatMessages(
    userId: number,
    form?: { offset?: Integer; limit?: Integer },
  ): Promise<Message[]>;

  // ==========================================================================
  // Bot API 10.1: Rich Messages, Join Request Queries
  // ==========================================================================

  /**
   * Send a rich message.
   * @see https://core.telegram.org/bots/api#sendrichmessage
   */
  sendRichMessage(
    chatId: number | string,
    content: InputRichMessageContent,
    form?: {
      business_connection_id?: string;
      message_thread_id?: Integer;
      disable_notification?: boolean;
      protect_content?: boolean;
      reply_parameters?: ReplyParameters;
      reply_markup?: ReplyMarkup;
    },
  ): Promise<Message>;

  /**
   * Send a rich message draft.
   * @see https://core.telegram.org/bots/api#sendrichmessagedraft
   */
  sendRichMessageDraft(
    chatId: number | string,
    content: InputRichMessageContent,
    form?: {
      business_connection_id?: string;
      message_thread_id?: Integer;
    },
  ): Promise<Message>;

  /**
   * Answer a chat join request query.
   * @see https://core.telegram.org/bots/api#answerchatjoinrequestquery
   */
  answerChatJoinRequestQuery(
    chatJoinRequestId: Integer,
    queryId: string,
    form?: {
      text?: string;
      parse_mode?: string;
      entities?: MessageEntity[];
      business_connection_id?: string;
      message_thread_id?: Integer;
      reply_markup?: InlineKeyboardMarkup;
    },
  ): Promise<boolean>;

  /**
   * Send a Web App message to a chat join request.
   * @see https://core.telegram.org/bots/api#sendchatjoinrequestwebapp
   */
  sendChatJoinRequestWebApp(
    chatJoinRequestId: Integer,
    webApp: SentWebAppMessage,
    form?: {
      business_connection_id?: string;
      message_thread_id?: Integer;
      disable_notification?: boolean;
      protect_content?: boolean;
      reply_markup?: InlineKeyboardMarkup;
    },
  ): Promise<boolean>;

  // ==========================================================================
  // Bot API 10.2: Ephemeral Messages
  // ==========================================================================

  /**
   * Edit the text of an ephemeral message.
   * @see https://core.telegram.org/bots/api#editephemeralmessagetext
   */
  editEphemeralMessageText(
    chatId: number | string,
    ephemeralMessageId: string,
    text: string,
    form?: {
      parse_mode?: string;
      entities?: MessageEntity[];
      link_preview_options?: LinkPreviewOptions;
      reply_markup?: InlineKeyboardMarkup;
    },
  ): Promise<Message>;

  /**
   * Edit the media of an ephemeral message.
   * @see https://core.telegram.org/bots/api#editephemeralmessagemedia
   */
  editEphemeralMessageMedia(
    chatId: number | string,
    ephemeralMessageId: string,
    media: InputMedia,
    form?: {
      reply_markup?: InlineKeyboardMarkup;
    },
    fileOptions?: FormQueryOptions,
  ): Promise<Message>;

  /**
   * Edit the caption of an ephemeral message.
   * @see https://core.telegram.org/bots/api#editephemeralmessagecaption
   */
  editEphemeralMessageCaption(
    chatId: number | string,
    ephemeralMessageId: string,
    form?: {
      caption?: string;
      parse_mode?: string;
      caption_entities?: MessageEntity[];
      show_caption_above_media?: boolean;
      reply_markup?: InlineKeyboardMarkup;
    },
  ): Promise<Message>;

  /**
   * Edit the reply markup of an ephemeral message.
   * @see https://core.telegram.org/bots/api#editephemeralmessagereplymarkup
   */
  editEphemeralMessageReplyMarkup(
    chatId: number | string,
    ephemeralMessageId: string,
    form?: {
      reply_markup?: InlineKeyboardMarkup;
    },
  ): Promise<Message>;

  /**
   * Delete an ephemeral message.
   * @see https://core.telegram.org/bots/api#deleteephemeralmessage
   */
  deleteEphemeralMessage(chatId: number | string, ephemeralMessageId: string, form?: FormQueryOptions): Promise<boolean>;
}

// ============================================================================
// ADDITIONAL HELPER TYPES
// ============================================================================

/** This object represents one special entity in a text message entity. */
export interface BotCommandScope {
  type: string;
}

export interface BotCommandScopeDefault extends BotCommandScope {
  type: 'default';
}

export interface BotCommandScopeAllPrivateChats extends BotCommandScope {
  type: 'all_private_chats';
}

export interface BotCommandScopeAllGroupChats extends BotCommandScope {
  type: 'all_group_chats';
}

export interface BotCommandScopeAllChatAdministrators extends BotCommandScope {
  type: 'all_chat_administrators';
}

export interface BotCommandScopeChat extends BotCommandScope {
  type: 'chat';
  chat_id: number | string;
}

export interface BotCommandScopeChatAdministrators extends BotCommandScope {
  type: 'chat_administrators';
  chat_id: number | string;
}

export interface BotCommandScopeChatMember extends BotCommandScope {
  type: 'chat_member';
  chat_id: number | string;
  user_id: number;
}

/** ShippingOptions type alias for shipping_query response. */
export interface ShippingOptions {
  shipping_options: ShippingOption[];
}

/** MessageId is returned by copyMessage and similar methods. */
export interface MessageId {
  message_id: Integer;
}

/** GameHighScore represents one row of a high scores table. */
export interface GameHighScore {
  position: Integer;
  user: User;
  score: Integer;
}

/** The errors module. */
export as namespace TelegramBot;
