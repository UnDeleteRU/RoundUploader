<?php

$content = file_get_contents('php://input');
if ($_SERVER['CONTENT_TYPE'] != 'image/jpeg') {
    http_response_code(415);
    die;
}

//$_SERVER['HTTP_CONTENT_NAME']
//$_SERVER['HTTP_CONTENT_LAST_MODIFIED']

if (!$content) {
    http_response_code(400);
    die;
}

do {
    $base = md5(microtime());
    $path = 'upload/' . $base . '.jpg';
} while (file_exists($path));

file_put_contents($path, $content);

const THUMB_SIZE = 90;
$image = imagecreatefromstring($content);
$thumb = imagecreatetruecolor(THUMB_SIZE, THUMB_SIZE);

$size = [imagesx($image), imagesy($image)];
$paddingLeft = $size[0] > $size[1] ? round(($size[0] - $size[1]) / 2) : 0;
$paddingTop = $size[0] < $size[1] ? round(($size[1] - $size[0]) / 2) : 0;

if (!imagecopyresampled($thumb, $image, 0, 0, $paddingLeft, $paddingTop, THUMB_SIZE, THUMB_SIZE, $size[0] - $paddingLeft, $size[1] - $paddingTop)) {
    unlink($path);
    http_response_code(500);
    die;
}

$thumbPath = 'upload/' . $base . '_thumb.jpg';
imagejpeg($thumb, $thumbPath, 95);

header('Content-Type: application/json');
echo json_encode(['thumb' => $thumbPath]);
