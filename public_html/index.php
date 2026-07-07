<?php
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (strpos($uri, '/api') === 0) {
    chdir('/data/project/wikiforms/backend/public');
    require '/data/project/wikiforms/backend/public/index.php';
    exit;
}
$file = __DIR__ . $uri;
if ($uri !== '/' && file_exists($file) && !is_dir($file)) {
    return false;
}
readfile(__DIR__ . '/index.html');
