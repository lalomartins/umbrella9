Multi-project wrapper for local installations of Cloud9 IDE
===========================================================

Umbrella9 is a manager for local Cloud9 IDE instances. It's designed to have two modes of operation:

- Client: Umbrella9 plugs into your session management on your laptop/desktop/tablet/etc; you'd start it with your session, and it shuts itself down when the session closes.

- Server: Run it with session management off and authentication on in a server for an experience similar to (but not nearly quite as cool as) the commercial Cloud9 offering.

Currently only the client version is supported, and only on Linux (using dbus for sessions). Pull requests accepted!

How to use it in a nutshell
---------------------------

1. Run Umbrella9 (by hand, or put it in your session autostart, or system startup).

2. Visit <http://localhost:9900/>.

3. Register projects (by entering paths in your filesystem). Each project becomes then a tab in the top-level Umbrella9 UI.

4. Click a project tab. If Cloud9 is already running for that project, it will just load in the tab. Otherwise, you'll be given a simple UI with minimal project metadata and the option to start Cloud9. Use Cloud9 normally.

5. You can close each Cloud9 instance by clicking the X button on the top right.
