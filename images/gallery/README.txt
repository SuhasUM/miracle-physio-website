Gallery placeholder images
==========================

This folder is intended to hold the local gallery photos referenced by gallery.html.

Expected filenames (kebab-case, matching the alt text of each gallery item):

  - clinic-reception.jpg
  - treatment-room.jpg
  - rehab-equipment.jpg
  - physio-session.jpg
  - therapy-session.jpg
  - modern-equipment.jpg
  - our-team.jpg
  - rehab-area.jpg
  - exercise-therapy.jpg

Each <img> in gallery.html already has an onerror fallback that points back to the
original Unsplash URL, so the page will not look empty until the real photos are
added here.

To add real photos, simply drop a file with the matching name (e.g. clinic-reception.jpg)
into this folder, replacing the placeholder. The carousel will pick it up automatically.
