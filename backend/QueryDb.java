import java.sql.*;
public class QueryDb {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:h2:file:./data/cryptovaultx", "sa", "password");
        ResultSet rs = conn.createStatement().executeQuery("SELECT * FROM transactions ORDER BY created_at DESC LIMIT 5");
        ResultSetMetaData md = rs.getMetaData();
        while (rs.next()) {
            for (int i=1; i<=md.getColumnCount(); i++) {
                System.out.print(md.getColumnName(i) + "=" + rs.getString(i) + " | ");
            }
            System.out.println();
        }
    }
}
