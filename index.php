<!--
To change this template, choose Tools | Templates
and open the template in the editor.
-->
<?php

  if (preg_match('/\.(?:png|jpg|jpeg|gif)$/', $_SERVER["REQUEST_URI"])) {
      return false;    // serve the requested resource as-is.
  } else {
    $url = explode("/", substr($_SERVER["REQUEST_URI"], 1));
    if ($url[0] == "profesores" && count($url) == 1) {
      $version = "profesores";
    } else if ($url[0] == "estudiantes" && count($url) == 1) {
      $version = "estudiantes";
    } else {
      header("Location: /error.php");
      die();
    }
  }

?>

<!DOCTYPE html>
<html>
    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="icon" type="image/png" href="favicon.png" />
		<link rel="apple-touch-icon" href="scripts/NotPacked/images/icon.png"/>
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta   id="wholeViewport" name="viewport" content="width=device-width, maximum-scale=1.0, initial-scale=1 ,user-scalable=no">
		<script>
            var $MOBILE_PHONE;
            if (navigator.userAgent.match(/(android|iphone|ipad|blackberry|symbian|symbianos|symbos|netfront|model-orange|javaplatform|iemobile|windows phone|samsung|htc|opera mobile|opera mobi|opera mini|presto|huawei|blazer|bolt|doris|fennec|gobrowser|iris|maemo browser|mib|cldc|minimo|semc-browser|skyfire|teashark|teleca|uzard|uzardweb|meego|nokia|bb10|playbook)/gi)) {
                if (((screen.width >= 480) && (screen.height >= 800)) || ((screen.width >= 800) && (screen.height >= 480)) || navigator.userAgent.match(/ipad/gi)) {
                    $MOBILE_PHONE = false;//tablette
                } else {
                    $MOBILE_PHONE = true;//mobile
                }
            } else {
                $MOBILE_PHONE = false;//Desktop
            }
              if ($MOBILE_PHONE) {
                document.getElementById('wholeViewport').setAttribute("content", "width=device-width, maximum-scale=0.7, initial-scale=0.7 ,user-scalable=no");
            }
        </script>
    </head>
    <body style="-ms-touch-action: none;" oncontextmenu="return false;">

  		<?php
  		// mb_internal_encoding("UTF-8");
  		// function file_get_contents_utf8($fn) {
       	// 	$content = file_get_contents($fn);
        	// 	return mb_convert_encoding($content, 'UTF-8',
        	// 	mb_detect_encoding($content, 'UTF-8', true));
  		// }

      // router.php
        if (isset($_GET["url"])) {
          $u=$_GET["url"];
          if (!$u) $u=$_POST["url"];
        }
        if (isset($_GET["url2"])) {
          $u2=$_GET["url2"];
          if (!$u2) $u2=$_POST["url2"];
        }
        if (isset($_GET["hide_ctrlpanel"])) {
          $t=$_GET["hide_ctrlpanel"];
          if (!$t) $t=$_POST["hide_ctrlpanel"];
        }
        if (isset($_GET["lang"])) {
          $l=$_GET["lang"];
          if (!$l) $l=$_POST["lang"];
        }
        if (isset($_GET["presentation"])) {
          $p=$_GET["presentation"];
          if (!$p) $p=$_POST["presentation"];
        }
        if (isset($_GET["show_tools"])) {
          $tls=$_GET["show_tools"];
          if (!$tls) $tls=$_POST["show_tools"];
        }
        if (isset($_GET["googleApps"])) {
          $ga=$_GET["googleApps"];
          if (!$ga) $ga=$_POST["googleApps"];
        }
        if (isset($_GET["googleId"])) {
          $gid=$_GET["googleId"];
          if (!$gid) $gid=$_POST["googleId"];
        }
        if (isset($_POST["file_content"])) {
          $f=$_POST["file_content"];
        }

        if (isset($u) && (strpos($u, 'google.com') !== false)) {
            $pattern="/([-\w]{25,})/";
            preg_match($pattern, $u, $res);
            if ((is_array($res)) && (count($res) == 1)) {
                $args="id=".$res[0];
                if ($t) $args=$args."&hide_ctrlpanel=".$t;
                if ($l) $args=$args."&lang=".$l;
                if ($p) $args=$args."&presentation=".$p;
                if ($tls) $args=$args."&show_tools=".$tls;
                echo "<script>location.replace('https://script.google.com/macros/s/AKfycbyEZOu-YDVlJWrrMBdDXdWzMF1HI2ONmxKTmtgYF-cFdUXyq44/exec?".$args."')</script>";
            }
        };

        echo "<script src=\"scripts/DGPad.js\" ";
            // data-url est utilisé pour les adresses relatives, et pour certains
            // sites acceptant le cross-domain-origin :
        if (isset($version)) echo " data-version=\"$version\"";
        if (isset($u2)) echo " data-url=\"$u2\"";
        if (isset($u)) echo " data-source=\"".base64_encode(file_get_contents("$u"))."\"";
        if (isset($f)) echo " data-source=\"$f\"";
        if (isset($t)) echo " data-hidectrlpanel=\"$t\"";
        if (isset($l)) echo " data-lang=\"$l\"";
        if (isset($p)) echo " data-presentation=\"$p\"";
        if (isset($tls)) echo " data-tools=\"$tls\"";
        if (isset($ga)) echo " data-googleapps=\"$ga\"";
        if (isset($gid)) echo " data-googleid=\"$gid\"";
        echo "></script>";

  		?>

   </body>
</html>
