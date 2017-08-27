namespace Theater
{
	Modernizr.addTest("mobile", () => RegExp("Mobile").test(navigator.userAgent));

	export class Utility
	{
		private static lockCount = 0;

		public static endsWith(haystack: string, needle: string, position?: number)
		{
			const subjectString = haystack;
			if (typeof position !== "number" || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length)
			{
				position = subjectString.length;
			}
			position -= needle.length;
			const lastIndex = subjectString.lastIndexOf(needle, position);
			return (lastIndex !== -1 && lastIndex === position) as boolean;
		}

		public static lockBodyScroll(allowMobile = false)
		{
			if ((!Modernizr.mobile || allowMobile) && $("#lock-scroll-scrollbar-offset").length === 0)
			{
				const scrollBarExists = $("body").height() > $(window).height();
				if (!scrollBarExists)
				{
					return;
				}

				const scrollBarWidth = this.calculateScrollbarWidth();

				$("head").append(`
<style id='lock-scroll-scrollbar-offset'>
	html.lockBodyScroll body { overflow: hidden; }
	html.lockBodyScroll header { padding-right: ${scrollBarWidth}; width: calc(100% - ${scrollBarWidth}); } 
	html.lockBodyScroll #content { padding-right: ${scrollBarWidth}; box-sizing: border-box; }
</style>`);
			}
			$("html").addClass("lockBodyScroll");

			this.lockCount++;
		}

		public static unlockBodyScroll()
		{
			if (this.lockCount > 0)
			{
				this.lockCount--;
				if (this.lockCount === 0)
				{
					$("html").removeClass("lockBodyScroll");
				}
			}
		}

		private static calculateScrollbarWidth()
		{
			const a = $("<div class='modal-measure-scrollbar'/>").prependTo($("body"));
			const b = $("<div class='inner'/>").appendTo(a);
			const c = (a.width() - b.width()) + "px";
			return c;
		}
	}
}