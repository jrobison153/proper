#!/usr/bin/env node
import 'babel-polyfill';
import cli from '../interface/cli';
import hopper from '../hopper';

cli(hopper, console);
