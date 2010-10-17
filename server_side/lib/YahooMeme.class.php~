<?php

/**
 *  Meme PHP 
 *  ---------
 *  A simple PHP class to interface with Yahoo! Meme API. 
 *  @author bigo 
 **/

require_once( "YahooYQLQuery.class.php" );

/* debug galponero! */
function wtf( $smth ) {
    echo "<pre>"; var_dump( $smth ); echo "</pre>";
}

class MemeCore {

    private $_result = null;

    public function execute( $query) {
        $yql = new YahooYQLQuery( );
        if ( !$this->_result ) {
            throw new Exception( "No records found" ); 
        }
        if ( $this->_result->query->results->meme ) {
            return $this->_memeResults( );
        }
        else if ( $this->_result->query->results->post ) {
            return $this->_postResults( );
        } else {
            return $this->_result;
        }
    }

    private function _memeResults( ) {
        $result = $this->_result->query->results; 
        if (count( $result->meme ) == 1 ) {
            return new Meme( $result->meme );
        }
        else if ( count( $result->meme ) > 1 ) {
            $ret = array( );
            foreach( $result->meme as $row ) {
               $ret[] = new Meme( $row ); 
            }
            return $ret;
        }
    }

    private function _postResults( ) {
        $result = $this->_result->query->results; 
        if ($result && count( $result->post ) == 1 ) {
            return new Post( $result->post );
        }
        else if ( count( $result->post ) > 1 ) {
            $ret = array( );
            foreach( $result->post as $row ) {
               $ret[] = new Post( $row ); 
            }
            return $ret;
        }
    }
}

class MemeRepository {
    
    private $core = null;

    public function __construct(  ) {
        $this->core = new MemeCore( );
    }

    // weirdest method overloading ever?!
    public function __call( $method, $args ) {
        if ( $method == "getPosts" ) {
            if ( count( $args ) == 3 ) {
                return $this->_getPosts( $args[0], $args[1], $args[2] );
            } else if ( count( $args ) == 2 ) {
                return $this->_getPosts( $args[0], $args[1] );
            } else return $this->_getPosts( $args[0] );
        }
        if ( $method == "following" ) {
            if ( count( $args ) == 3 ) {
                return $this->_following( $args[0], $args[1], $args[2] );
            } else if ( count( $args ) == 2 ) {
                return $this->_following( $args[0], $args[1] );
            } else return $this->_following( $args[0] );
        }
        if ( $method == "followers" ) {
            if ( count( $args ) == 3 ) {
                return $this->_followers( $args[0],$args[1], $args[2] );
            } else if ( count( $args ) == 2 ) {
                return $this->_followers( $args[0], $args[1] );
            } else return $this->_followers( $args[0] );
        }
    }

    public function insert($app, $type, $content, $caption=null ) {;
      if (in_array($type, array('photo', 'video')))
	  return $app->yql("INSERT INTO meme.user.posts (type, content, caption) VALUES ('$type', '$content', '$caption')",array("format" => "json", "callback" => "void"));
      else
          return $app->yql( "INSERT INTO meme.user.posts ( type, content ) VALUES ( '$type' ,'".$content ."')", array(
														  "format" => "json", "callback" => "void") );

    }
    
    /* this function should be private but for testing purposes its visibility has been 
     * changed to public. PLEASE DO NOT CALL IT DIRECTLY! */
    public function _yql_query( $query ) {
        return $this->core->execute( $query );
    }

    public function get( $name ) {
        return $this->_yql_query( "SELECT * FROM meme.info WHERE name ='".$name."'" );
    }

    protected function _following( $name, $offset=0, $limit=10, $_use_guid=false ) {
        $guid = $_use_guid ? $name : $this->get( $name )->guid;
        return $this->_yql_query( "SELECT * FROM meme.following( $offset, $limit ) WHERE owner_guid = '$guid'" );
    }

    protected function _followers ( $name, $offset=0, $limit=10, $_use_guid=false ) {
        $guid = $_use_guid ? $name : $this->get( $name )->guid;
        return $this->_yql_query( "SELECT * FROM meme.followers( $offset, $limit ) WHERE owner_guid = '$guid'" );    
    }

    public function search( $query ) {
        return $this->_yql_query( "SELECT * FROM meme.people WHERE query = '$query'" );
    }

    protected function _getPosts( $guid, $offset, $limit  ) {
        return $this->_yql_query( "SELECT * FROM meme.posts( $offset, $limit ) WHERE owner_guid ='$guid'" );
    }
}

class Meme extends MemeRepository {
   
    public  $name;
    public  $guid;
    public  $title;
    public  $description;
    public  $url;
    public  $avatar_url;
    public  $language;
    public  $follower_count;
    
    public function __construct( $data = array() ) {
        parent::__construct( ); 
        $this->name = $data->name;
        $this->guid = $data->guid;
        $this->title = $data->title;
        $this->description = $data->description;
        $this->url = $data->url;
        $this->avatar_url = $data->avatar_url;
        $this->language = $data->language;
        $this->follower_count = $data->follower_count;
    }

    /* most weird method overloading EVER! */
    public function __call( $method, $args ) {
        if ( $method == 'following' ) {
            if ( count( $args ) == 3 ) {
                return parent::_following( $args[0], $args[1], $args[2] );
            } else if ( count( $args ) == 2 ) {
                return $this->_following( $args[0], $args[1] );
            } else {
                return $this->_following(  );
            }
        }
        if ( $method == 'getPosts' ) {
            if ( count( $args ) == 3 ) {
                return parent::_getPosts( $args[0], $args[1], $args[2] );
            } else if ( count( $args ) == 2 ) {
                return $this->_getPosts( $args[0], $args[1] );
            } else {
                return $this->_getPosts(  );
            }
        }
    }

    protected function _getPosts( $offset=0, $limit=10 ) {
        if ( !$this->guid ) {
            throw new Exception( 'You are trying get posts from a unknown meme... guid is empty' );
            return;
        }
        return parent::_getPosts( $this->guid, $offset, $limit );
    }

    protected function _following( $start = 0,  $limit = 10 ) {
        if ( $this->guid ) {
            return parent::_following( $this->guid, $start, $limit, true );
        }
        return parent::_following( $this->name, $start, $limit );   
    }

    protected function _followers ( $start = 0, $limit = 10  ) {
        if ( $this->guid ) {
            return parent::_followers( $this->guid, $start, $limit, true );
        }
        return parent::_followers( $this->name, $start, $limit );   
    }
    
    public function toString( $fullInfo = false  ) {
        $ret = "( ";
        $ret .= "Name=$this->name,";
        $ret .= "Guid=$this->guid";
        if( $fullInfo !== false ) {
            $ret .= ",Title=$this->title,";
            $ret .= "Description=$this->description,";
            $ret .= "Url=$this->url,";
            $ret .= "Avatar_url=$this->avatar_url,";
            $ret .= "Language=$this->language,";
            $ret .= "Follower_count=$this->follower_count";
        }
        $ret .= " )";
        return $ret;
    }
}

class PostRepository {
    
    public function __construct(  ) {
        $this->core = new MemeCore( );
    }
    
    private function _yql_query( $query ) {
        return $this->core->execute( $query );
    }

    public function popular( $offset=0, $limit=10, $locale='' ) {
        return $this->_yql_query( "SELECT * FROM meme.popular( $offset, $limit ) WHERE locale='$locale'" );
    }

    public function search( $query, $offset, $limit ) {
        return $this->_yql_query( "SELECT * FROM meme.search( $offset, $limit ) WHERE query = '$query'" );
    }
}

class Post extends PostRepository {
    public $guid;
    public $pubid;
    public $type;
    public $caption;
    public $content;
    public $comment = null;
    public $url;
    public $timestamp;
    public $repost_count;
    public $origin_guid = null;
    public $origin_pubid = null;
    public $via_guid = null;

    public function __construct( $data = array(  ) ) {
        parent::__construct( ); 
        $this->guid = $data->guid;
        $this->pubid = $data->pubid;
        $this->type = $data->type;
        $this->caption = $data->caption;
        $this->content = $data->content;
        $this->comment = $data->comment;
        $this->url = $data->url;
        $this->timestamp = $data->timestamp;
        $this->respost_count = $data->repost_count;
        $this->origin_guid = $data->origin_guid;
        $this->origin_pubid = $data->origin_pubid;
        $this->via_guid = $data->via_guid;
    }

    public function toString( $fullInfo = false ) {
        $ret = "( ";
        $ret .= "Guid=$this->guid,";
        $ret .= "Pubid=$this->pubid,";
        $ret .= "Type=$this->type";
        if ( $fullInfo !== false ) {
            $ret .= ",Caption=$this->caption,";
            $ret .= "Content=$this->content,";
            $ret .= "Url=$this->url,";
            $ret .= "Timestamp=$this->timestamp,";
            $ret .= "Repost_count=$this->repost_count,";
            $ret .= "Origin_guid=$this->origin_guid,";
            $ret .= "Origin_pubid=$this->origin_pubid,";
            $ret .= "Via_guid=$this->via_guid";
        }
        $ret .= " )";
        return $ret;
    }
}
?>
