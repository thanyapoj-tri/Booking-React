<?php
    require_once __DIR__ . '/config.php';

    class API {
        function Select() {
            $db = new Connect;
            $users = array();
            $data = $db->prepare("SELECT * FROM users ORDER BY id");
            $data -> execute();
            while($results = $data->fetch(PDO::FETCH_ASSOC)) {
                $users[] = array(
                    'id' => $results['id'],
                    'first_name' => $results['first_name'],
                    'last_name' => $results['last_name'],
                    'email' => $results['email'],
                    'gender' => $results['gender'],
                    'ip_address' => $results['ip_address'],
                )
            }
            return json_encode($users);
        }
    }

    $API = new API;
    header("Content-Type: application/json");
    echo $API->Select();
?>