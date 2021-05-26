Pioneer dev flow


1. debug test locally

2. make change to server locally

3. tests pass locally

4. tests fail remote

	4a. deploy server blue

	4b. e2e test server from local (on blue env) verify version?

	4c. if fail
		repeat till pass locally

5. run local e2e pass against remote server

	5a. if change is NOT in core
		skip to step 7 

6. bump version pioneer (core)

7. assign release version number

	7a. push release-canidate branch to github
	7b. push release to leeroy

8. publish packages

9. leeroy hook pioneer-server
	build stage(blue) (has :latest flag)
	run e2e test jobs
		if fail mark release failed

10. if blue pass e2e

11. merge release branch to master

12. deploy master

13. mark blue(staging) as green

	leeroy hook
		release balancing snowfall
			x percent over x time

(state green/green) load balancing traffic

Note: additional release candidates can be pushed while still in snowfall
	state (green(x percent)/green (y percent) / blue 0(percent))

leeroy reaper
	any (green) environment with percent 0, remove
