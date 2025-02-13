package com.steam.notification.websocket;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import org.springframework.stereotype.Component;
import java.util.HashMap;
import java.util.Map;

/**
 * WebSocket Service
 */
@Component
@ServerEndpoint("/ws/{sid}")
public class WebSocketServer {
    //store Session
    private static Map<String, Session> sessionMap = new HashMap();

    /**
     * connect successfully
     */
    @OnOpen
    public void onOpen(Session session, @PathParam("sid") String sid) {
        // store session
        sessionMap.put(sid, session);
    }

    /**
     * receive client message
     *
     * @param message client message
     */
    @OnMessage
    public void onMessage(String message, @PathParam("sid") String sid) {
    }

    /**
     * close client
     *
     * @param sid client id
     */
    @OnClose
    public void onClose(@PathParam("sid") String sid) {
        // clear session
        sessionMap.remove(sid);
    }

    /**
     * send message to all client
     *
     * @param ids client ids
     *
     * @param message send message
     */
    public void sendToAllClient(String[] ids, String message) {
        for (String id : ids) {
            sendToClient(id, message);
        }
    }

    /**
     * send message to client
     *
     * @param id client id
     *
     * @param message send message
     */
    public void sendToClient(String id, String message) {
        if (sessionMap.containsKey(id)) {
            Session session = sessionMap.get(id);
            try {
                session.getBasicRemote().sendText(message);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
