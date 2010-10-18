<?php
/**
Welcome to the ugliest piece of code ever
*/

session_start();
// change config.php to reflect your app credentials
require_once( dirname( __FILE__ ) .  "/config.php" );
/*
 * TODO: Deal with token refreshing
 */
// including YOS classes
require_once(dirname(__FILE__) . '/../lib/OAuth.php');
require_once(dirname(__FILE__) . '/../lib/YahooOAuthApplication.class.php');

require_once(dirname( __FILE__ ) . '/../lib/YahooMeme.class.php' );
$action = null;
if ( isset($_REQUEST['action']) ) {
    $action = $_REQUEST['action'];
}


$app = new YahooOAuthApplication( OAUTH_CONSUMER_KEY, OAUTH_CONSUMER_SECRET, OAUTH_APP_ID, OAUTH_DOMAIN ); 

switch($action) {
 case 'request_token':
  // this URL will be called after user login. If you are modifying this code, don't forget to exchange the token!!!
  $post_type = urlencode($_REQUEST['post_type']);
  $callback = APP_URL . '/oAuthExample.php?action=authorized&post_type='.$post_type;
  $request_token = $app->getRequestToken( $callback );
  $_SESSION['request_token_key'] = $request_token->key;
  $_SESSION['request_token_secret'] = $request_token->secret;
  $_SESSION['full_content'] = @$_REQUEST['content'];
  $_SESSION['full_caption'] = @$_REQUEST['caption'];
  $_SESSION['post_type'] = $_REQUEST['post_type'];
  $redirect_url = $app->getAuthorizationUrl( $request_token );
  // send user to Yahoo! so he can authorize our example to post on his Meme
  Header( "Location: $redirect_url");
  break;

 case 'authorized':
  $request_token = new OAuthConsumer($_SESSION['request_token_key'], $_SESSION['request_token_secret']);
  $response = $app->getAccessToken($request_token, $_GET['oauth_verifier'] );
  parse_str( $response, $params);
    
  $access_token = $params['oauth_token'];
  $access_token_secret = $params['oauth_token_secret'];
  $_SESSION['ACCESS_TOKEN'] = $access_token;
  $_SESSION['ACCESS_TOKEN_SECRET'] = $access_token_secret;
  $content = $_SESSION['full_content'];
  $caption = $_SESSION['full_caption'];
  
  $token = new OAuthToken($_SESSION['ACCESS_TOKEN'], $_SESSION['ACCESS_TOKEN_SECRET']);
  $app->token = $token;
  /* Congratulations! You've just logged in into Yahoo! and now are able to 
   * post on meme :P' */
  $meme = new MemeRepository();
  $meme->insert($app, $_SESSION['post_type'], $content, (isset($caption) && !empty($caption)) ? $caption : null);
    
  print "<h1>CONGRATS! YOU DID IT (or not.. You'd better double check :P)</h1>";
  break;
 
 default:
   if ($_REQUEST['content']) {
     $_SESSION['full_content'] = urldecode(@$_REQUEST['content']);
     $_SESSION['full_caption'] = urldecode(@$_REQUEST['caption']);
     $_SESSION['post_type'] = $_REQUEST['post_type'];
   } 
}

?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
    <head>
        <title>ChroMeme!</title>
    </head>
    <body>
        <p>The goal of this example is to show you how to add content to Meme using your own app ;P</p>
        <form name="post_text" method="GET">
            <input type="hidden" name="action" value="request_token" />
            <input type="hidden" name="post_type" value="<?php echo $_SESSION['post_type']; ?>" /> 
<?php
    if ($_SESSION['post_type'] == "photo") {
	    echo "<input type='hidden' name='content' value='".$_SESSION['full_content']."' /><img src='".$_SESSION['full_content']."'/><br />";
    }
    else if ($_SESSION['post_type'] == "video") {
      echo "<input type='hidden' name='content' value='".$_SESSION['full_content']."' />";  
	  echo '<object width="425" height="344">'.
		  '<param name="movie" value="'.$_SESSION['full_content'].'">'.
		  '.</param><param name="allowFullScreen" value="true">'.
		  '</param><param name="allowscriptaccess" value="always">'.
		  '</param><embed src="'.$_SESSION['full_content'].'" '.
		  'type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="425" height="344">'.
		  '</embed></object> ';

	}
?>
			
<?php
    if ($_SESSION['post_type'] == "text") {
?>
	    <br />content:
	    <textarea name="content" cols="80" rows="10"><?php echo $_SESSION['full_content']; ?></textarea>

<?php
	} else {
	
    }
?>	    <br />caption (for photos and videos)
	    <textarea name="caption" cols="80" rows="10"><?php echo $_SESSION['full_caption']; ?></textarea>
            <input type="submit" value="post this on meme!" />
        </form>
    </body>
</html>
