package lk.ijse.dep10.app.api;

import lk.ijse.dep10.app.dto.MessageDTO;
import lk.ijse.dep10.app.dto.ResponseErrorDTO;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import  javax.servlet.http.Part;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.ServletContext;
import java.io.File;
import java.io.IOException;
import java.sql.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/messages")
public class MessageController {

    @Autowired
    private ServletContext servletContext;
    @Autowired
    private BasicDataSource pool;
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
public ResponseEntity<?> gettingMessages(@RequestBody MessageDTO messageDTO) {

        try (Connection connection = pool.getConnection()) {
            PreparedStatement stm = connection.prepareStatement("INSERT INTO  Message (date, name, email, message,organization) VALUE (?,?,?,?,?)", Statement.RETURN_GENERATED_KEYS);


            stm.setString(1, messageDTO.getDate());
            stm.setString(2, messageDTO.getName());
            stm.setString(3, messageDTO.getEmail());
            stm.setString(4, messageDTO.getMessages());
            stm.setString(5, messageDTO.getOrganization());
            stm.executeUpdate();

            return new ResponseEntity<>(HttpStatus.CREATED);

        } catch (SQLException e) {
            if (e.getSQLState().equals("23000")) {
                return new ResponseEntity<>(
                        new ResponseErrorDTO(HttpStatus.CONFLICT.value(), e.getMessage()),
                        HttpStatus.CONFLICT);
            } else {
                e.printStackTrace();
                return new ResponseEntity<>(
                        new ResponseErrorDTO(500, e.getMessage()),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @DeleteMapping("/images/{fileName:.+}")
    public ResponseEntity<?> deleteImages(@PathVariable String fileName) {
        String imgDirectPath = servletContext.getRealPath("/images");
        File filePath = new File(imgDirectPath);
        String[] imageNames = filePath.list();

        if (imageNames != null) {
            for (String imageName : imageNames) {
                if (imageName.equals(fileName)) {
                    File imgFile = new File(filePath, imageName);
                    imgFile.delete();
                }
            }
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public List<String> saveImage(@RequestPart("imageKey")List<Part> Files, UriComponentsBuilder urlBuilder) {
        ArrayList<String> imageUrlList = new ArrayList<>();

        if (Files != null) {
            String imgDirectPath = servletContext.getRealPath("/images");
            for (Part imageFile : Files) {
                String imageFilePath = new File(imgDirectPath, imageFile.getSubmittedFileName()).getAbsolutePath();
                File fileDir = new File(imgDirectPath);



                if (!fileDir.exists()) {
                    if (fileDir.mkdirs()) {
                        System.out.println("Directory created successfully: " + fileDir.getAbsolutePath());
                    } else {
                        System.out.println("Failed to create the directory: " + fileDir.getAbsolutePath());

                    }
                }

                try {
                    imageFile.write(imageFilePath);
                    UriComponentsBuilder cloneBuilder = urlBuilder.cloneBuilder();
                    String imageUrl = cloneBuilder.
                            pathSegment("images", imageFile.getSubmittedFileName()).toUriString();//images== place where image store
                    imageUrlList.add(imageUrl);

                } catch (IOException e) {
                    e.printStackTrace();
                    System.out.println("adasda");
//
                }

            }
        }
            return imageUrlList;
    }

}





