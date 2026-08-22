Add-Type -AssemblyName System.Drawing
$img=[System.Drawing.Image]::FromFile('c:\Users\91966\Desktop\map website\IMG_0489.PNG')
Write-Output ("Size: " + $img.Width + "x" + $img.Height)
$bmp=New-Object System.Drawing.Bitmap $img
$colors=@{}
for($x=0;$x -lt $bmp.Width;$x+=5){
  for($y=0;$y -lt $bmp.Height;$y+=5){
    $p=$bmp.GetPixel($x,$y)
    if($p.A -gt 200){
      $key=('{0:X2}{1:X2}{2:X2}' -f $p.R,$p.G,$p.B)
      if($colors.ContainsKey($key)){$colors[$key]++}else{$colors[$key]=1}
    }
  }
}
Write-Output "=== Saturated colors (non-near-white, step 2) ==="
$colors=@{}
for($x=0;$x -lt $bmp.Width;$x+=2){
  for($y=0;$y -lt $bmp.Height;$y+=2){
    $p=$bmp.GetPixel($x,$y)
    if($p.A -gt 200){
      $key=('{0:X2}{1:X2}{2:X2}' -f $p.R,$p.G,$p.B)
      if($colors.ContainsKey($key)){$colors[$key]++}else{$colors[$key]=1}
    }
  }
}
$colors.GetEnumerator() | Where-Object { $_.Value -gt 5 -and $_.Key -notmatch '^(F[CDEF]|EF|E[CDEF])' } | Sort-Object Value -Descending | Select-Object -First 40 | ForEach-Object { Write-Output ($_.Key + " count=" + $_.Value) }
Write-Output "=== Dark colors ==="
$colors.GetEnumerator() | Where-Object { $_.Value -gt 3 -and $_.Key -match '^0[0-9A-F]' } | Sort-Object Value -Descending | Select-Object -First 20 | ForEach-Object { Write-Output ($_.Key + " count=" + $_.Value) }
$img.Dispose()
$bmp.Dispose()
