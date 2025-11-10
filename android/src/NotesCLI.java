  import java.io.*;
import java.net.*;
import java.util.Scanner;
import org.json.*;

public class NotesCLI {

    private static final String BASE_URL = "http://10.134.14.80:8000/routes";
    private static String token = null;
    private static Scanner sc = new Scanner(System.in);

    public static void main(String[] args) {
        while (true) {
            System.out.println("\n=== NotesSync CLI ===");
            if (token == null) {
                System.out.println("1. Register");
                System.out.println("2. Login");
                System.out.println("0. Exit");
                System.out.print("Choose: ");
                String choice = sc.nextLine();
                switch (choice) {
                    case "1": register(); break;
                    case "2": login(); break;
                    case "0": System.exit(0);
                    default: System.out.println("Invalid choice"); break;
                }
            } else {
                System.out.println("1. List Notes");
                System.out.println("2. Add Note");
                System.out.println("3. Update Note");
                System.out.println("4. Delete Note");
                System.out.println("5. Logout");
                System.out.println("0. Exit");
                System.out.print("Choose: ");
                String choice = sc.nextLine();
                switch (choice) {
                    case "1": listNotes(); break;
                    case "2": addNote(); break;
                    case "3": updateNote(); break;
                    case "4": deleteNote(); break;
                    case "5": token = null; break;
                    case "0": System.exit(0);
                    default: System.out.println("Invalid choice"); break;
                }
            }
        }
    }

    // =================== Register =====================
    private static void register() {
        try {
            System.out.print("Email: ");
            String email = sc.nextLine();
            System.out.print("Password: ");
            String password = sc.nextLine();

            JSONObject json = new JSONObject();
            json.put("email", email);
            json.put("password", password);

            JSONObject res = post("/register.php", json);
            System.out.println(res.optString("message", "No message"));
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    // =================== Login ========================
    private static void login() {
        try {
            System.out.print("Email: ");
            String email = sc.nextLine();
            System.out.print("Password: ");
            String password = sc.nextLine();

            JSONObject json = new JSONObject();
            json.put("email", email);
            json.put("password", password);

            JSONObject res = post("/login.php", json);
            if (res.optBoolean("success", false)) {
                token = res.getString("token");
                System.out.println("Login successful!");
            } else {
                System.out.println("Login failed: " + res.optString("message"));
            }
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    // =================== List Notes ===================
    private static void listNotes() {
        try {
            JSONArray notes = get("/notes_list.php");
            if (notes.length() == 0) {
                System.out.println("No notes found.");
                return;
            }
            System.out.println("\n--- Notes ---");
            for (int i = 0; i < notes.length(); i++) {
                JSONObject note = notes.getJSONObject(i);
                System.out.printf("%d) [%s] %s\n", i+1,
                        note.getString("created_at"),
                        note.getString("content"));
            }
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    // =================== Add Note =====================
    private static void addNote() {
        try {
            System.out.print("Enter note content: ");
            String content = sc.nextLine();
            JSONObject json = new JSONObject();
            json.put("content", content);

            JSONObject res = post("/notes_add.php", json);
            System.out.println(res.optString("message", "Note added!"));
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    // =================== Update Note ==================
    private static void updateNote() {
        try {
            listNotes();
            System.out.print("Enter note ID to update: ");
            String id = sc.nextLine();
            System.out.print("New content: ");
            String content = sc.nextLine();

            JSONObject json = new JSONObject();
            json.put("id", id);
            json.put("content", content);

            JSONObject res = put("/update_note.php", json);
            System.out.println(res.optString("message", "Updated!"));
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    // =================== Delete Note ==================
    private static void deleteNote() {
        try {
            listNotes();
            System.out.print("Enter note ID to delete: ");
            String id = sc.nextLine();

            JSONObject json = new JSONObject();
            json.put("id", id);

            JSONObject res = delete("/delete_note.php", json);
            System.out.println(res.optString("message", "Deleted!"));
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    // =================== HTTP Helpers =================
    private static JSONObject post(String route, JSONObject json) throws Exception {
        return send("POST", route, json);
    }

    private static JSONObject put(String route, JSONObject json) throws Exception {
        return send("PUT", route, json);
    }

    private static JSONObject delete(String route, JSONObject json) throws Exception {
        return send("DELETE", route, json);
    }

    private static JSONArray get(String route) throws Exception {
        URL url = new URL(BASE_URL + route);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Authorization", "Bearer " + token);

        BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        StringBuilder sb = new StringBuilder();
        String line; while ((line = reader.readLine()) != null) sb.append(line);
        reader.close();

        return new JSONArray(sb.toString());
    }

    private static JSONObject send(String method, String route, JSONObject json) throws Exception {
        URL url = new URL(BASE_URL + route);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod(method);
        conn.setDoOutput(true);
        conn.setRequestProperty("Content-Type", "application/json");
        if (token != null) conn.setRequestProperty("Authorization", "Bearer " + token);

        OutputStream os = conn.getOutputStream();
        os.write(json.toString().getBytes());
        os.flush(); os.close();

        BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        StringBuilder sb = new StringBuilder();
        String line; while ((line = reader.readLine()) != null) sb.append(line);
        reader.close();

        return new JSONObject(sb.toString());
    }
}