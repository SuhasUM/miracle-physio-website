Set-Location 'c:/Users/91966/Desktop/map/map-website-updated/work/site'
$files = @('about.html','doctors.html','testimonials.html','gallery.html','faq.html','contact.html','appointment.html','home-services.html')
$old = '<div class="socials">
            <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
            <a href="#" aria-label="Google"><i class="fab fa-google"></i></a>
            <a href="#" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
          </div>'
$new = '<div class="socials">
            <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
            <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
          </div>'
foreach ($f in $files) {
  $c = Get-Content -Raw $f
  $c2 = $c.Replace($old, $new)
  if ($c2 -ne $c) {
    Set-Content -Path $f -Value $c2 -NoNewline
    Write-Output "$f updated"
  } else {
    Write-Output "$f NO MATCH - needs review"
  }
}

