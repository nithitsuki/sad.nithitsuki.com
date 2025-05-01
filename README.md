# Student Attendance Dashboard (S.A.D)

A website designed to help students track their attendance and maintain their desired attendance percentage.

![Attendance Dashboard](https://github.com/nithitsuki/class-skipulator/blob/main/public/screenshot1.0.png)

## 🎯 Overview

Student Attendance Dashboard (S.A.D) is an intuitive attendance tracking tool that helps students:

- Monitor their class attendance across multiple subjects
- Calculate how many more classes they can afford to miss while maintaining their required attendance percentage
- Visualize their attendance data with informative charts
- Make informed decisions about attending or skipping future classes

## ✨ Features

- **Subject Management**: Add, view, and delete subjects
- **Attendance Tracking**: Track classes occurred vs. classes attended
- **Visual Indicators**: Color-coded cards show attendance status at a glance
- **Skip Calculator**: Automatically calculates how many more classes you can skip
- **Data Persistence**: Stores your data in the browser's local storage
- **Responsive Design**: Works on desktop and mobile devices

## 📝 How to Use

1. **Go to an instance of S.A.D**: Visit the deployed application (e.g., `sad.nithitsuki.com`).

2. **Add a Subject**: Click the "Add a Subject" button and fill in the required information:
    - Subject Name
    - Classes per Week
    - Classes Occurred
    - Classes Attended

3. **View Attendance**: Each subject card displays:
    - Attendance percentage in a donut chart
    - Classes occurred and attended
    - Number of skipped classes
    - Number of classes you can still skip

4. **Update a Subjects attendance**: Coming Soon™

5. **Delete a Subject**: Click "Delete Subject" at the bottom of any subject card

## 💻 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **UI/Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **Data Visualization**: [Recharts](https://recharts.org/)
- **State Management**: [React Hooks](https://react.dev/reference/react) (useState, useEffect)
- **Data Persistence**: [Browser LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

## 🚀 Upcoming Features (Help Welcomed!)

I'm also looking to improve Student Attendance Dashboard (S.A.D). Here are some ideas for future enhancements (contributions are welcome!):

The following features are listed in order of priority (highest to lowest):

- [ ] **Edit Attendance Info**: Easily update the number of classes attended or occurred for an existing subject.
- [ ] **Edit Subject Data**: Allow modification of subject name or classes per week after initial creation.
- [ ] **Improved UI/UX**: Enhance the application's visual design and usability.
- [ ] **Customizable Requirements**: Set different attendance percentage requirements per subject.
- [ ] **Data Export/Import**: Allow users to back up and restore their data.
- [ ] **Notifications**: Reminders for upcoming classes or low attendance warnings.
- [ ] **Semester/Term Management**: Group subjects by academic terms.

## 🤝 Contributing

For more info on contributing, running locally, contribution guidelines and technical info, please refer to the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## 📜 License

This project is licensed under the GNU General Public License v3.0 - see the LICENSE file for details.

---
