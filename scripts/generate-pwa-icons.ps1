Add-Type -AssemblyName System.Drawing
$outputDirectory = Join-Path $PSScriptRoot '../apps/web/public'
foreach ($size in @(180, 192, 512)) {
  $bitmap = New-Object System.Drawing.Bitmap($size, $size)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.Clear([System.Drawing.ColorTranslator]::FromHtml('#601700'))
  $graphics.ScaleTransform(($size / 128.0), ($size / 128.0))
  $sand = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#E0D0C1'))
  $pen = New-Object System.Drawing.Pen($sand, 11)
  $graphics.DrawArc($pen, 45, 32, 38, 44, 180, 180)
  $graphics.FillEllipse($sand, 33, 55, 62, 48)
  $graphics.FillRectangle($sand, 40, 73, 48, 24)
  $path = Join-Path $outputDirectory "icon-$size.png"
  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $pen.Dispose()
  $sand.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}
