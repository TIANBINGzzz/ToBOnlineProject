package com.steam.project.listener;

import com.steam.common.constants.MQConstants;
import com.steam.common.domain.message.UpdateMessage;
import com.steam.project.service.impl.ProjectServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.*;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UpdateMessageListener {
    private final ProjectServiceImpl projectServiceImpl;

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(
                    name = MQConstants.UPDATE_PROJECT_QUEUE_NAME,
                    durable = "true",
                    arguments = @Argument(name = "x-queue-mode", value = "lazy")
            ),
            exchange = @Exchange(name = MQConstants.UPDATE_EXCHANGE_NAME, type = "topic"),
            key = MQConstants.UPDATE_COMPANY_KEY
    ))
    public void listenUpdateNameSuccess(UpdateMessage message){
        projectServiceImpl.updateName(message.getUserId(), message.getName());
    }
}
