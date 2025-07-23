

# Portfolio Website Instructions

## Run Instructions
1. `git add .`
2. `git commit -m "description of commit"`
3. `git push`
4. `npm run build`
5. `npm run deploy`

## Other Notes
- **Add cities:**
  - Edit `project_cities` in `MapboxGlobe.tsx` to add new cities (with lat/long).
  - Decide if the city should be in `zoomGatedCities` (only shows pin at zoom >= 3).
  - After adding a city, update `places.json` with notes and (optionally) an image for the popup.
- **Add projects:**
  - Add new projects to `projects.json`.
  - Make sure `work_experience`, `tech_stack`, and `tech_stack2` fields are set appropriately.
  - Add the correct location(s) for each project.
