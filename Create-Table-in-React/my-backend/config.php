<?php
    class Connect extends PDO {
        public function __construct(){
            parent::__construct("mysql:host=localhost;dbname=shphp_api", "shadmin", "P@$$w0rd")
            array(PDO::MYSQL_ATTR_INIT_COMMAND=>"SET NAMES utf8");
            $this->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        }
    }
?>