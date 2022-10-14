import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import notificationTemplate from "./adaptiveCards/notification-default.json";
import { CardData } from "./cardModels";
import { bot } from "./internal/initialize";

// An Azure Function HTTP trigger.
//
// This endpoint is provided by your application to listen to events. You can configure
// your IT processes, other applications, background tasks, etc - to POST events to this
// endpoint.
//
// In response to events, this function sends Adaptive Cards to Teams. You can update the logic in this function
// to suit your needs. You can enrich the event with additional data and send an Adaptive Card as required.
//
// You can add authentication / authorization for this API. Refer to
// https://aka.ms/teamsfx-notification for more details.
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  // By default this function will iterate all the installation points and send an Adaptive Card
  // to every installation.
  for (const target of await bot.notification.installations()) {
    await target.sendAdaptiveCard(
      AdaptiveCards.declare<CardData>(notificationTemplate).render({
        title: "New Event Occurred!",
        appName: "Contoso App Notification",
        description: `This is a sample http-triggered notification to ${target.type}`,
        notificationUrl: "https://www.adaptivecards.io/",
      })
    );

    // Note - you can filter the installations if you don't want to send the event to every installation.

    /** For example, if the current target is a "Group" this means that the notification application is
     *  installed in a Group Chat.
    if (target.type === NotificationTargetType.Group) {
      // You can send the Adaptive Card to the Group Chat
      await target.sendAdaptiveCard(...);

      // Or you can list all members in the Group Chat and send the Adaptive Card to each Team member
      const members = await target.members();
      for (const member of members) {
        // You can even filter the members and only send the Adaptive Card to members that fit a criteria
        await member.sendAdaptiveCard(...);
      }
    }
    **/

    /** If the current target is "Channel" this means that the notification application is installed
     *  in a Team.
    if (target.type === NotificationTargetType.Channel) {
      // If you send an Adaptive Card to the Team (the target), it sends it to the `General` channel of the Team
      await target.sendAdaptiveCard(...);

      // Alternatively, you can list all channels in the Team and send the Adaptive Card to each channel
      const channels = await target.channels();
      for (const channel of channels) {
        await channel.sendAdaptiveCard(...);
      }

      // Or, you can list all members in the Team and send the Adaptive Card to each Team member
      const members = await target.members();
      for (const member of members) {
        await member.sendAdaptiveCard(...);
      }
    }
    **/

    /** If the current target is "Person" this means that the notification application is installed in a
     *  personal chat.
    if (target.type === NotificationTargetType.Person) {
      // Directly notify the individual person
      await target.sendAdaptiveCard(...);
    }
    **/
  }

  context.res = {};
};

export default httpTrigger;
