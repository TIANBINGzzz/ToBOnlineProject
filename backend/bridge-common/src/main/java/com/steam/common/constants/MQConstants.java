package com.steam.common.constants;

public interface MQConstants {
    // exchanger for update username
    String UPDATE_EXCHANGE_NAME = "update.topic";
    // queue for update username
    String UPDATE_NOTIFICATION_QUEUE_NAME = "update.success.notification.queue";
    String UPDATE_PROJECT_QUEUE_NAME = "update.success.project.queue";
    String UPDATE_APPLICATION_QUEUE_NAME = "update.success.application.queue";
    // key for update username
    String UPDATE_COMPANY_KEY = "update.success.company";
    String UPDATE_PROFESSIONAL_KEY = "update.success.professional";
    String UPDATE_GENERAL_KEY = "update.success.*";
}
