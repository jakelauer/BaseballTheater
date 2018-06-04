import {InternalAnimateUtility} from "@Utility/Internal/InternalAnimateUtility";
import {InternalDataUtility} from "@Utility/Internal/InternalDataUtility";
import {InternalMlbUtility} from "@Utility/Internal/InternalMlbUtility";
import {InternalPageDataUtility} from "@Utility/Internal/InternalPageDataUtility";
import {InternalPromisesUtility} from "@Utility/Internal/InternalPromisesUtility";
import {InternalResponsiveUtility} from "@Utility/Internal/InternalResponsiveUtility";
import {InternalTimerUtility} from "@Utility/Internal/InternalTimerUtility";

export namespace Utility
{
	export var Data = InternalDataUtility;
	export var Animate = InternalAnimateUtility;
	export var Mlb = InternalMlbUtility;
	export var PageData = InternalPageDataUtility;
	export var Promises = InternalPromisesUtility;
	export var Responsive = InternalResponsiveUtility;
	export var Timer = InternalTimerUtility;
}