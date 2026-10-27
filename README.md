# Ticket Journal

# Author: Joel Kaiser  

## Project Description

Many individuals face modern digital clutter and accumulating financial costs from recurring cloud storage subscriptions (such as Apple iCloud, Google Photos, and Snapchat) kept primarily to preserve personal event photos and videos. This storage clutter limits device memory for capturing future moments and fails to provide a dedicated, event-centered environment where friends and family can reflect together. Ticket Journal addresses this problem by serving as an event tracker and personal album host, freeing local phone storage while organizing life milestones.

Ticket Journal is a full-stack web application designed to catalog, manage, and display events and specialized event data. The system combines a base event data model—containing general attributes such as event name, date, location, and description—with specialized category fields for specific event types, such as concerts (musician, venue type) and festivals (lineup, duration). Users interact through an intuitive browser frontend to log new events, inspect detailed summary cards, edit pre-populated forms, filter events by category or date, and clear unwanted records.

The application follows a separated full-stack architecture, connecting an interactive client interface to a backend REST API built to handle complete CRUD (Create, Read, Update, Delete) operations. This structure ensures low-latency client rendering (under 1 second) and dynamic DOM updates while maintaining business logic and input validation on the server.

## Main Technologies and Tools

* **Frontend:** HTML, CSS, Vanilla JavaScript (Browser Fetch API)
* **Backend and Framework:** Node.js, Express framework
* **Development Environment:** Visual Studio Code (VS Code)
* **API Testing and Verification:** Postman
* **Version Control and Code Hosting:** Git, GitHub