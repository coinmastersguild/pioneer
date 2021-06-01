Pioneer TODO
==========

E2E test extensions
==========

verify app gets invocation event

lifecycle hook in invocation
    created
    signed
    confirmed
    fullfilled    

handle "transfers not supported on username"
if error, throw away queryKey and try again

update invocation for swap outgoing



Features
==========

show swap failure

expand tests to all supported assets

invocation page instant
	or just url? open tx pending model??
		maybe a push when a user signs?
			click button to update/rbf




ASGARDX
========
debug context switching


Desktop
========

debug stuck "startup" window (why need refresh?)

startup
	if first time
		confirm total balance

	if wrong, start path wizard	

offer more wallets

offer public addresses to watch

Confirm username
	offer change

Enable applications
	just thorchain

show assets/ balances like keepkey client
	send/receive/tx history

view LP/THOR positions


Bugs
==========

Pairing window confirm

if pioneer server not running at start it can't reconnect

if username has symbols it errors without UX

"enter" doesnt "add" on seed recovery

Give apps start ratings

default to 5?

3, server has signed off
4, x amount of users signed
5. multiple servers signed off





FEATURES
============

platform
	on load go to dashboard with all installed/bookmarked apps

	Open on demand

	Extra large pioneer/search in the center



Pioneer-sdk into axiom?


* multi-wallet + metamask support

	on pioneers.dev pair with metamask

	register wallet

	sub to events

	in pioneer bex
		reconize its installed on pioneers.dev

		if new offer pair with platform

	if pioneer && metamask
		push events

	load dashboard	


* BEX

	I need an address
		1 click to clipboard


	Push events

	all *new events 
		click to acknolodge
			click info for a verbose* description from pioneer	

		click to ack all



	
	Startup
		is new user?
			yes.
				setup new wallet
					if keepkey
			no.
				Pairing process

	is "locked"				


Workflows
	if BEX user, and installes native

	if Native and installs BEX

Add any token by search
	* default to only have info on tokens with balances




fresh app in platform repo

no sidebars

just compass in center

maybe use settings popup over radial?


Dashboard
	Starting apps
		Load all wallets
			load all assets


load installed apps


Pages?

Zoom?

Bubble pop out?

Search bar?

https://www.npmjs.com/package/vue-radial-menu


Pioneer SDK
	some way for user to *login
		portis?

	Get address for user




Push open app
	is new user?
		add to contacts

	want to ignore all users?
		/settings Notification settings	


Types of events
	Buy fox?
	Open Uniswap to fox


	payment requested
	send x to x


	add contact


Deploy pioneer remotely

host pioneer api on rosetta.network

host packaged download on citadels.io

host framework docs on pioneers.dev

Build citadel Broswer extension!
https://quasar.dev/quasar-cli/developing-browser-extensions/configuring-bex


Citadel node Docs

Citadel Lightning Docs

pioneer SDK workflow



Epic Pioneer .dev docs
======================
https://www.notion.so/invite/eb88cf693c3f377aaa09b02750403ecd6bb9d9e8



Epic Run your own node
=================

run pioneer server

run citadel dev server

deploy pioneer server via k8 DO

deploy citadel server via k8 DO



Epic Shapeshift Native wallet pairing
==============
login via shapeshift


Epic "True multiwallet"
===============

Export reports for each

add new wallet from seed

add NEW keepkey (auto detect new)



Epic "EASY extractions"
===============

Add custom path

Scan everything* ish* smart

Walkthough helper UX

Epic large wallets
===================

Use a json wallet format db for wallet file
update config, goal. import large amonuts of keypairs


Epic Eventing
===================
push on payment events

auto detect wallet



Epic Fio events
==================
push
send x to x

user must type confirm


Epic FULL keepkey
===================
restore from seed

update keepkey versions

load seed

(pairity with go-keepkey?)

download latest firmware

verify firmware?

upload firmware



Epic ALL hardware
==================
trezor bridge?


Epic Onboarding
=================
auto offboard exodus users (hard!) cant decode .bin block from decrypt

auto offboard metamask users (harder! ?ish maybe not?)
https://ethereum.stackexchange.com/questions/52658/where-does-metamask-store-the-wallet-seed-file-path
cant figure out how to get chrome localstorage conveintly


pairing code with mobile
	//option show pairing code
	//import during setup on mobile

Shapeshift-sdk
	Platform wallet


Epic pioneer server funding
===============

info return

* funding address/s

* server info timeTillOffline, 

	
Calulate time till offline
cost basis of server billing usage * profit

Default infinity

clients auto switch on expiration - bufer



Tech debt
===============

Public wallet format

Goals:
	Get ALL accounts for asset (dont miss money)
		btc segwit
		accounts 1 + n that have moniez
		custom paths (extractions)


	Prefrence
		generate address on preference xpubs
		whats "master"


Wallets with differnt passwords
	check at startup
	if they dont match, offer migration




download cli

generate new project with sdk

	Options
		platforms supported
			web
			exectron
			ios
			android


		Wallet support
			SS
			hardware
			wallet connect


creates repo

generates auto docs


Hello world app


shapeshift Publish

register to account

publish to app store




go to main platform download's

enable untrusted apps

install app


Setup dialogs
=============

new wallet
	offer password
	offer shapeshift
	offer store your own backup file
	display seed
	enforce seed verification

setup wizzard
	if shapeshift
		login with shapeshift



connect hardware
	
	if trezor install bridge

	if ledger download ledger apps

	if keepkey continue



