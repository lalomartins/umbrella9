What's next for Umbrella9
=========================

Planned
-------

- Notify client of registry changes

- Project CRUD (also nicer-looking UI)

- Shared Cloud9 settings

- Shared Cloud9 settings can be turned off per project

- Projects that don't use shared settings can be initialized with a copy of the shared settings

- RELEASE 0.2

- Server mode

  - Make session management, dbus optional (by command line)

  - Authentication (optional by command line)

  - Option to listen on given IP(s) rather than localhost (by command line)

- RELEASE 0.3

- “Other” tab where you can point Ace to arbitrary files, and use Ace/Umbrella9 as a non-IDE editor

- RELEASE 0.4

- Handle some DBus messages

  - start/stop project

  - open file in “Other” mode

- RELEASE 0.5

Maybes
------

- Proxy for C9 rather than redirecting (requires that c9 can work from a non-root base URL, there's some progress there but it doesn't quite work)

- Shut down Cloud9 on “Quit” (requires either proxying, or hacking C9, or maybe some other fanciness)
