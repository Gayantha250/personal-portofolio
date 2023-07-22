package lk.ijse.dep10.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO {

  private   String date;
    private   String name;
    private   String email;
    private   String messages;
    private  String organization;

}
