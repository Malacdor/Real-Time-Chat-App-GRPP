Objectives. For this project, we have 4 objectives:
1.	Establish real-time communication between two users. Implement a persistent, low-latency channel using WebSockets to enable real-time communication between two users.
2.	Design and implement Client-Server Architecture OR Peer-to-Peer Architecture.
3.	Ensure Reliable Message Delivery. Incorporate methods to handle message delivery confirmation, failures, and retries. Additionally, incorporate basic security measures to ensure secure communication.
4.	Design and Implement a Basic User Interface. Create and implement a simple graphical user interface (GUI) for sending and receiving messages in real time.
System Overview/Proposed Solution. Our project will build a real-time distributed chat application using WebSockets to provide instant, low-latency communication between users. The system will use a WebSocket gateway connected to a message broker (like Redis or Kafka) to route and deliver messages reliably across multiple servers. To ensure fault tolerance and scalability, it will use a stateless architecture with data stored in a database and Redis for session management and presence tracking, and we may also integrate Firebase or React Native for cross-platform support and real-time data handling.

Technologies and Tools. The following resources will be used:
•	Java. Primary programming language for back-end application development.
•	JavaScript/HTML OR JavaFX. For building a browser-based user GUI.

//ESSENTIAL
Set index to public.
install Node and add to project
