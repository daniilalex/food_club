<?php
$_POST = json_decode(file_get_contents('php://input'), true);//decode json files from users getting values
echo var_dump($_POST);//to see data from client, convert them to string and show us