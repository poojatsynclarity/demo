<?php
namespace RFI\DB;

class DB
{
    private $dbHost     = "localhost";
    private $dbUsername = "root";
    private $dbPassword = "";
    private $dbName     = "db_rfi";
    
    public function __construct()
    {
        if (!isset($this->db)) {
            // Connect to the database
            $conn = new \mysqli($this->dbHost, $this->dbUsername, $this->dbPassword, $this->dbName);
            if ($conn->connect_error) {
                die("Failed to connect with MySQL: " . $conn->connect_error);
            } else {
                $this->db = $conn;
            }
        }
    }
    
    /*
     * Returns rows from the database based on the conditions
     * @param string name of the table
     * @param array select, where, order_by, limit and return_type conditions
     */
    public function getRows($table, $conditions = array())
    {
        $sql = 'SELECT ';
        $sql .= array_key_exists("select", $conditions)?$conditions['select']:'*';
        $sql .= ' FROM '.$table;
        if (array_key_exists("where", $conditions)) {
            $sql .= ' WHERE ';
            $i = 0;
            foreach ($conditions['where'] as $key => $value) {
                $pre = ($i > 0)?' AND ':'';
                $sql .= $pre.$key." = '".$value."'";
                $i++;
            }
        }
        
        if (array_key_exists("like", $conditions) && !empty($conditions['like'])) {
            $sql .= (strpos($sql, 'WHERE') !== false)?' AND ':' WHERE ';
            $i = 0;
            $likeSQL = '';
            foreach ($conditions['like'] as $key => $value) {
                $pre = ($i > 0)?' AND ':'';
                $likeSQL .= $pre.$key." LIKE '%".$value."%'";
                $i++;
            }
            $sql .= '('.$likeSQL.')';
        }
        
        if (array_key_exists("like_or", $conditions) && !empty($conditions['like_or'])) {
            $sql .= (strpos($sql, 'WHERE') !== false)?' AND ':' WHERE ';
            $i = 0;
            $likeSQL = '';
            foreach ($conditions['like_or'] as $key => $value) {
                $pre = ($i > 0)?' OR ':'';
                $likeSQL .= $pre.$key." LIKE '%".$value."%'";
                $i++;
            }
            $sql .= '('.$likeSQL.')';
        }
        
        if (array_key_exists("order_by", $conditions)) {
            $sql .= ' ORDER BY '.$conditions['order_by'];
        }
        
        if (array_key_exists("start", $conditions) && array_key_exists("limit", $conditions)) {
            $sql .= ' LIMIT '.$conditions['start'].','.$conditions['limit'];
        } elseif (!array_key_exists("start", $conditions) && array_key_exists("limit", $conditions)) {
            $sql .= ' LIMIT '.$conditions['limit'];
        }
        $result = $this->db->query($sql);
        
        if (array_key_exists("return_type", $conditions) && $conditions['return_type'] != 'all') {
            switch ($conditions['return_type']) {
                case 'count':
                    $data = $result->num_rows;
                    break;
                case 'single':
                    $data = $result->fetch_assoc();
                    break;
                default:
                    $data = '';
            }
        } else {
            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    $data[] = $row;
                }
            }
        }
        return !empty($data)?$data:false;
    }
    
    /*
     * Insert data into the database
     * @param string name of the table
     * @param array the data for inserting into the table
     */
    public function insert($table, $data)
    {
        if (!empty($data) && is_array($data)) {
            $columns = '';
            $values  = '';
            $i = 0;
            if (!array_key_exists('created_at', $data)) {
                $data['created_at'] = date("Y-m-d H:i:s");
            }
            if (!array_key_exists('updated_at', $data)) {
                $data['updated_at'] = date("Y-m-d H:i:s");
            }
            foreach ($data as $key => $val) {
                $pre = ($i > 0)?', ':'';
                $columns .= $pre.$key;
                $values  .= $pre."'".$val."'";
                $i++;
            }
            $query = "INSERT INTO ".$table." (".$columns.") VALUES (".$values.")";// echo $query; die;
            $insert = $this->db->query($query);
            return $insert?$this->db->insert_id:false;
        } else {
            return false;
        }
    }
    
    /*
     * Update data into the database
     * @param string name of the table
     * @param array the data for updating into the table
     * @param array where condition on updating data
     */
    public function update($table, $data, $conditions)
    {
        if (!empty($data) && is_array($data)) {
            $colvalSet = '';
            $whereSql = '';
            $i = 0;
            if (!array_key_exists('updated_at', $data)) {
                $data['updated_at'] = date("Y-m-d H:i:s");
            }
            foreach ($data as $key => $val) {
                $pre = ($i > 0)?', ':'';
                $colvalSet .= $pre.$key."='".$val."'";
                $i++;
            }
            if (!empty($conditions)&& is_array($conditions)) {
                $whereSql .= ' WHERE ';
                $i = 0;
                foreach ($conditions as $key => $value) {
                    $pre = ($i > 0)?' AND ':'';
                    $whereSql .= $pre.$key." = '".$value."'";
                    $i++;
                }
            }
            $query = "UPDATE ".$table." SET ".$colvalSet.$whereSql; // echo $query; die;
            $update = $this->db->query($query);
            return $update?$this->db->affected_rows:false;
        } else {
            return false;
        }
    }
    
    /*
     * Delete data from the database
     * @param string name of the table
     * @param array where condition on deleting data
     */
    public function delete($table, $conditions)
    {
        $whereSql = '';
        if (!empty($conditions) && is_array($conditions)) {
            $whereSql .= ' WHERE ';
            $i = 0;
            foreach ($conditions as $key => $value) {
                $pre = ($i > 0)?' AND ':'';
                $whereSql .= $pre.$key." = '".$value."'";
                $i++;
            }
        }
        $query = "DELETE FROM ".$table.$whereSql;
        $delete = $this->db->query($query);
        return $delete?true:false;
    }
}
