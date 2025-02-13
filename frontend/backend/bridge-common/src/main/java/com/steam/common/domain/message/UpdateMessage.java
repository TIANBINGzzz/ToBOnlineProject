package com.steam.common.domain.message;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateMessage implements Serializable {
    private String userId;
    private String role;
    private String name;
}
