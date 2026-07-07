<?php
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$_SERVER['REQUEST_URI'] = $uri;
$_SERVER['SCRIPT_FILENAME'] = '/data/project/wikiforms/backend/public/index.php';
$_SERVER['SCRIPT_NAME'] = '/api.php';
$_SERVER['PHP_SELF'] = '/api.php' . substr($uri, 4);

chdir('/data/project/wikiforms/backend/public');
require '/data/project/wikiforms/backend/public/index.php';
