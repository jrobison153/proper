# Introduction
This module is an attempt to automate some of the amazing option trading practices, strategies, and rules laid out by the [Option Alpha](https://optionalpha.com) team, and primarily head trader Kirk Du Plessis. I wanted to find the option strategies with the correct profiles, like those that are ‘Fair and Equitable’ (FaE) (width of strikes * Prob ITM should be greater than or equal to credit taken on sale). Long story short, this process can take a lot of time done manually so I decided to automate it to help speed the process up.

# Option Alpha Fair and Equitable Trade Entry
The Option Alpha team has done a great job explaining the probability rules around 'High Probability' options trading, I'm not going to go into detail here. For a full education please view the [OP training modules](https://optionalpha.com/members/tracks), specifically [this training video](https://optionalpha.com/members/tracks/intermediate-course/correctly-pricing-options-strategies) they are completely free, yes free.

In summary though, the OA strategy for trade entry includes a check to make sure that you can beat the zero sum game of the markets. Really this means that if you place a high probability trade over and over again you should be taking in enough credit so that all of your win profits will be greater than your loss amounts. 

For example if you have 70% win probability and you make 10 trades, if you take in the right amount of credit on each trade when the probabilities play out you will be a net winner at the end of the day

Win $10

Win $10

Win $10

lose $20

Win $10

Win $10

Lose $20

Win $10

Win $10

Lose $20
 
Net Profit = $10

However if you do not take in enough credit, when the probabilities play you you will take a net loss at the end of the day

Win $5

Win $5

Win $5

lose $20

Win $5

Win $5

Lose $20

Win $5

Win $5

Lose $20
 
Net Profit = -$25

This package focuses on helping you find trades that in the long run will help you profit. The formula for this calculation is very simple: width of trade strikes * probability of being ITM >= Credit taken on the trade. Specifics are detailed below for each trade type.

# Usage

You'll need NPM and NodeJs, install from [here](https://nodejs.org)

Install this package

```bash
$ npm install -g oa-proper
```

Test the install

```bash
$ oa-proper
Basic Usage: proper --data-dir
```

Once installed you'll need put some data files in a directory for the program to analyze. Admittedly this is an Minimum Viable Product (MVP) so the process to do this is manual and a little klunky. 

First I'll describe what the program expects then I'll explain how I go about doing it.

# Input
The most important thing to know is that the program ingests comma delimited .csv files (yes this can be updated to pull data from a service however this is a quick and dirty way to get up and running). At a minimum your .csv file must include the following columns regarding option data for a given stock

* Prob.ITM - The probability of the option being In the Money
* Open.Int - Open interest for the option
* Volume - Volume traded
* Mark - the mark
* Exp - Expiration date
* Strike - option strike price


Example (Exported from Think Or Swim, includes more columns than needed but as long as the minimum required are present that's okay)
```csv
,,Open.Int,Volume,Prob.ITM,Mark,AS,BS,BID,BX,ASK,AX,Exp,Strike,BID,BX,ASK,AX,Open.Int,Volume,Prob.ITM,Mark,AS,BS,,
,,10,100,99.06%,135.900,2,2,133.60,A,138.20,A,16 MAR 18,170,0,I,.60,C,27,10,1.96%,.300,4,0,,
,,20,200,99.84%,130.800,2,2,128.60,A,133.00,A,16 MAR 18,175,0,P,.25,C,10,40,0.99%,.125,3,0,,
,,30,300,99.45%,125.850,2,2,123.60,A,128.10,A,16 MAR 18,180,0,I,.70,C,84,70,2.27%,.350,4,0,,

```

Each underlying stock symbol that you want to analyze should have it's option data in a separate file. You can include multiple expiration months in a single file

**NOTE: the program will not calculate credit spreads over expiration months, so if you include multiple expiration months in a single file credit spreads will be calculated and listed for each month independently.**

So the idea is you put all these .csv files in a directory and then run

```bash
$ oa-proper --data-dir <path to your option data directory goes here>
```

Example
```bash
$ oa-proper --data-dir ~/Documents/options/
2018-03-17-StockAndOptionQuoteForTSLA
Strategy            Credit/Debit        Risk                Reward/Risk Ratio   FaE Cost            FaE Cost Ratio      Expiration          Strikes
Bear Call Spread    1.53                5                   0.31                1.52                1.01                20 APR 18           340/345
```

In the above example I had one option data .csv file in the options directory for TSLA. The program found one trade that met the requirements for being a Fair and Equitable trade.

## Output
This program will out put the following data

* Strategy - the the type of strategy 
* Credit/Debit - credit or debit ($$$) on the trade. For Credit spreads this will be the dollar amount you take in on the option sale
* Risk - the maximum risk on the sale. For credit spreads this will be the dollar amount based on the width of the strikes. If the trade is an Iron Condor and the wings are uneven then the greater risk (the widest wing) will be displayed
* Reward/Risk Ratio - reward divided by risk
* FaE Cost - width of Strikes (RisK) * Probability of being ITM.
* FaE Cost Ratio - credit divided by FaE Cost
* Expiration - option expiration date
* Strikes - strikes listed as Short Strike/Long Strike (Iron Condors would be Short Call Strike/Long Call Strike/Short Put Strike/Long Put Strike)

Output is currently sorted by Reward/Risk Ratio in descending order.

# Current Support

## Spreads Calculated
The program will determine find Fair and Equitable trades for the following types of credit spreads

* Bear Call Spreads
* Bull Put Spreads
* Iron Condors

## Calculation Parameters
The Fair and Equitable trades are determined by the following parameters, note these are currently hard coded but in the future could easily be exposed as configuration parameters.

If you want to hack these numbers you can find them in the following source files

* [Iron Condors](https://github.com/jrobison153/proper/blob/master/src/strategies/ironCondorFinder.js)
* [Single Call/Put Credit Spreads](https://github.com/jrobison153/proper/blob/master/src/strategies/verticalCreditSpreadFinder.js)

### Probability of being In The Money
* Bear Call Spreads and Bull Put Spreads the Probability of being ITM for the short leg must be greater than 23% and less than 35%
* Iron Condors the Probability of being ITM for the short legs must be greater than 13% and less than 17%

### Open Interest
Options must have a minimum of 500 open interest to be considered for a spread. 

# Practical Usage

Okay so given that this process to get setup is a little manual I will give a detailed example of how I currently use this program.

First thing we need are those .csv files with the data required by this program. I use Think or Swim so exporting this rather easy. (If you don't use ToS you'll need to figure out how to export this data from your broker platform, sorry...) 
1. Create a folder on your computer where you want to store your .csv files. You only need to do this once and I typically remove the contents each new day that I'm running an analysis.
1. From the ToS `Trade` tab load the options for the underlying stock you want to analyze
1. Expand any expiration month(s) that you want this program to analyze, you can expand multiple months
1. In the upper right corner of the `Trade` tab click the menu and select 'Export to file...'.
1. Make sure the file type is CSV
1. Save the file to your option data folder
1. Open the .csv file in your text editor of choice and delete everything **except** the header row and of course all the option data. When you are done your .csv file should look like the following example (note this example includes multiple months of expiration data). Please also make sure there is a blank line at the end of the file, an annoying bug will present itself if you don't do this (will be fixed in the future)  
```csv
,,Volume,Open.Int,Prob.ITM,Mark,Delta,Vega,Theta,BID,BX,ASK,AX,Exp,Strike,BID,BX,ASK,AX,Volume,Open.Int,Prob.ITM,Mark,Delta,Vega,Theta,,
,,174,"3,008",35.61%,12.575,.41,.32,-.32,12.40,M,12.75,Z,20 APR 18,315,25.75,Q,26.00,Q,64,"2,518",64.59%,25.875,-.59,.32,-.30,,
,,38,277,33.64%,11.625,.39,.32,-.32,11.45,Q,11.80,X,20 APR 18,317.5,27.25,M,27.65,Q,13,232,66.59%,27.450,-.61,.32,-.29,,
,,485,"3,289",31.71%,10.725,.37,.32,-.31,10.60,Q,10.85,Z,20 APR 18,320,28.85,M,29.20,Q,65,"2,478",68.57%,29.025,-.63,.31,-.29,,
,,31,88,29.81%,9.850,.35,.31,-.30,9.70,M,10.00,Z,20 APR 18,322.5,30.50,M,30.85,Q,0,33,70.50%,30.675,-.65,.31,-.28,,
,,209,"2,730",28.02%,9.100,.33,.30,-.29,8.95,Q,9.25,Z,20 APR 18,325,32.20,Q,32.70,C,30,"1,040",72.31%,32.450,-.67,.30,-.27,,
,,10,190,6.91%,2.365,.10,.20,-.09,2.24,N,2.49,M,18 MAY 18,390,87.90,B,91.95,Z,0,0,94.06%,89.925,-.90,.18,-.07,,
,,52,327,6.07%,2.055,.09,.19,-.08,1.94,M,2.17,M,18 MAY 18,395,94.75,X,95.55,N,1,44,93.75%,95.150,-.89,.19,-.08,,
,,86,417,5.36%,1.805,.08,.17,-.07,1.70,N,1.91,M,18 MAY 18,400,99.55,X,100.30,Z,4,35,94.27%,99.925,-.90,.19,-.07,,
,,2,253,4.73%,1.585,.07,.16,-.07,1.48,N,1.69,M,18 MAY 18,405,102.20,B,106.25,Z,0,0,95.59%,104.225,-.91,.16,-.06,,
,,0,91,4.17%,1.395,.06,.14,-.06,1.29,N,1.50,H,18 MAY 18,410,107.00,H,111.25,Z,0,16,95.76%,109.125,-.91,.16,-.07,,
,,1,152,3.55%,1.165,.05,.13,-.05,1.09,N,1.24,M,18 MAY 18,415,111.85,W,116.15,Z,0,6,100.00%,114.000,-1.00,.00,.00,,
,,0,112,3.25%,1.080,.05,.12,-.05,.99,N,1.17,C,18 MAY 18,420,118.75,X,119.70,Z,10,0,95.55%,119.225,-.90,.17,-.08,,
,,5,359,2.85%,.945,.04,.11,-.05,.85,N,1.04,C,18 MAY 18,425,121.70,W,126.05,X,0,0,100.00%,123.875,-1.00,.00,.00,,
,,2,156,2.43%,.790,.04,.10,-.04,.73,N,.85,M,18 MAY 18,430,126.65,W,130.90,Z,0,0,100.00%,128.775,-1.00,.00,.00,,
,,0,211,2.17%,.710,.03,.09,-.04,.65,N,.77,M,18 MAY 18,435,131.60,W,135.80,Z,0,0,100.00%,133.700,-1.00,.00,.00,,
,,0,129,1.89%,.615,.03,.08,-.03,.55,C,.68,H,18 MAY 18,440,136.55,W,140.85,Z,0,0,100.00%,138.700,-1.00,.00,.00,,
,,0,44,1.51%,.475,.02,.07,-.03,.33,M,.62,M,18 MAY 18,445,141.60,W,146.05,X,0,0,100.00%,143.825,-1.00,.00,.00,,
,,4,347,1.33%,.420,.02,.06,-.03,.28,M,.56,M,18 MAY 18,450,146.60,W,150.60,Z,0,0,100.00%,148.600,-1.00,.00,.00,,
,,5,100,1.33%,.435,.02,.06,-.03,.35,M,.52,M,18 MAY 18,455,151.60,W,156.05,N,0,0,100.00%,153.825,-1.00,.00,.00,,
,,0,19,1.24%,.415,.02,.06,-.03,.29,M,.54,M,18 MAY 18,460,156.60,W,160.95,H,0,10,100.00%,158.775,-1.00,.00,.00,,
,,0,4,1.08%,.360,.02,.05,-.02,.26,M,.46,M,18 MAY 18,465,161.60,W,165.85,X,0,0,100.00%,163.725,-1.00,.00,.00,,

```

Once you have the cleaned up .csv file(s) in your option data directory run the oa-proper program on this directory. If you are a Mac/Linux user open a terminal, windows users open a dos prompt or whatever terminal emulator you like, and run

```bash
$ oa-proper --data-dir <path to dir>
```

# Contributing
Enhancements and bug fixes are greatly appreciated, please make sure any pull requests include appropriate tests.

# Bugs and Enhancement Requests
Please submit an issue to the [GitHub Repository](https://github.com/jrobison153/proper/issues)