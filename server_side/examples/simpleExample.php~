<?php

require_once( '../../lib/Yahoo/YahooMeme.class.php' );

$meme = new Meme( );
<<<<<<< HEAD

print "<h2>[info about bigo]</h2> <br />";
print $meme->get( "bigodines" )->toString( true );

print "<h2>[people following bigodines]</h2> <br/>";
$repo = new MemeRepository(  );
foreach( $repo->following( "bigodines" ) as $row) print $row->toString(  ) . "<br />";
=======
>>>>>>> master

print "<h2>[info about bigo]</h2> <br />";
print $meme->get( "bigodines" )->toString( true );

print "<h2>[people following bigodines]</h2> <br/>";
$repo = new MemeRepository(  );
foreach( $repo->following( "bigodines" ) as $row) print $row->toString(  ) . "<br />";


print "<h2>[bigo latest 5 posts]</h2>";
foreach( $meme->get( "bigodines" )->getPosts( 0, 5 ) as $row ) print $row->toString(  ) . "<br />\n";

print "<h2>[meme popular posts]</h2> <br />";
$post = new Post(  );
foreach( $post->popular( ) as $row) print $row->toString(  ) . "<br />";

print "<h2>[latest 5 posts from meme]</h2> <br />";
foreach ( $post->search( 'sort:cdate', 0, 5 ) as $row ) print $row->toString(  ) . "<br />\n";


?>
