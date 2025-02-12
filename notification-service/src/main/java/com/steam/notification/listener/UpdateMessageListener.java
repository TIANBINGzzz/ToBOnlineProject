package com.steam.notification.listener;

import com.steam.common.constants.MQConstants;
import com.steam.common.domain.message.UpdateMessage;
import com.steam.notification.service.INotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.*;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UpdateMessageListener {
    private final INotificationService notificationService;

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(
                    name = MQConstants.UPDATE_NOTIFICATION_QUEUE_NAME,
                    durable = "true",
                    arguments = @Argument(name = "x-queue-mode", value = "lazy")
            ),
            exchange = @Exchange(name = MQConstants.UPDATE_EXCHANGE_NAME, type = "topic"),
            key = MQConstants.UPDATE_GENERAL_KEY
    ))
    public void listenUpdateNameSuccess(Message message, UpdateMessage updateMessage){
        String routingKey = message.getMessageProperties().getReceivedRoutingKey();
        if ("update.success.company".equals(routingKey)) {
            notificationService.updateName(updateMessage.getUserId(), "company", updateMessage.getName());
        } else {
            notificationService.updateName(updateMessage.getUserId(), "professional", updateMessage.getName());
        }
    }
}
