Multi-project wrapper for local installations of Cloud9 IDE
===========================================================

Umbrella9 is a manager for local Cloud9 IDE instances. It's designed to have two modes of operation:

- Client: Umbrella9 plugs into your session management on your laptop/desktop/tablet/etc; you'd start it with your session, and it shuts itself down when the session closes.

- Server: Run it with session management off and authentication on in a server for an experience similar to (but not nearly quite as cool as) the commercial Cloud9 offering.

Currently only the client version is supported, and only on Linux (using dbus and freedesktop.org sessions). Pull requests accepted!

How to use it in a nutshell
---------------------------

1. Run Umbrella9 (by hand, or put it in your session autostart, or system startup).

2. Visit <http://localhost:9900/>.

3. Register projects (by entering paths in your filesystem). Each project becomes then a tab in the top-level Umbrella9 UI.

4. Click a project tab. If Cloud9 is already running for that project, it will just load in the tab. Otherwise, you'll be given a simple UI with minimal project metadata and the option to start Cloud9. Use Cloud9 normally.

5. Closing Cloud9 (using the “Quit Cloud9 IDE”) will shut down that Cloud9 instance and return you to the project metadata UI.

TODO
----

- Detect port conflicts

- Plug into session management; shut down when session ends

- RELEASE 0.1

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
