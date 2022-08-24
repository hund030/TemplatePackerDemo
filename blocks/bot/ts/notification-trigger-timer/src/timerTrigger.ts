import { AzureFunction, Context } from "@azure/functions";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import notificationTemplate from "./adaptiveCards/notification-default.json";
import { CardData } from "./cardModels";
import { bot } from "./internal/initialize";

// An Azure Function timer trigger.
//
// This function fires periodically. You can adjust the schedule in `../timerNotifyTrigger/function.json`.
//
// When this function is triggered, it sends an Adaptive Card to Teams. You can update the logic in this function
// to suit your needs. You can poll an API or retrieve data from a database, and based on the data, you can
// send an Adaptive Card as required.
const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
  const timeStamp = new Date().toISOString();

  // By default this function will iterate all the installation points and send an Adaptive Card
  // to every installation.
  for (const target of await bot.notification.installations()) {
    await target.sendAdaptiveCard(
      AdaptiveCards.declare<CardData>(notificationTemplate).render({
        title: "New Event Occurred!",
        appName: "Contoso App Notification",
        description: `This is a sample time-triggered notification (${timeStamp}).`,
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
};

export default timerTrigger;
