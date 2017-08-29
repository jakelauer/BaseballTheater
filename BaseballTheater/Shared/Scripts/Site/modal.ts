namespace Theater
{
	export class Modal
	{
		private $modalContainer: JQuery;
		public $modal: JQuery;

		private isInitialized = false;
		private modalOpenHtmlClass = "modal-open";
		private transitionDuration = 1000;

		public afterOpen = () => {};

		constructor(private readonly id: string, private content: string)
		{
		}

		private initialize()
		{
			if (this.isInitialized)
			{
				return;
			}

			this.buildModal();
			this.populateContent(this.content);

			this.isInitialized = true;
		}

		public open()
		{
			this.initialize();
			this.toggleHtmlClass(true);
			this.stopBodyFromScrolling();
			$("body").append(this.$modalContainer);
			setTimeout(() =>
				{
					this.$modalContainer.addClass("open");
					this.afterOpen();
				},
				1000 / 60);
			this.addListeners();
		}

		public close()
		{
			this.determineTransitionDuration();
			this.toggleHtmlClass(false);

			setTimeout(() =>
				{
					this.$modalContainer.remove();
				},
				this.transitionDuration);

			setTimeout(() => Utility.unpreventBodyScrolling(), 250);

			$(document).off(`.modal-${this.id}`);
			$("*").off(`.modal-${this.id}`);
		}

		private addListeners()
		{
			this.$modalContainer.on(`click.modal-${this.id}`,
				(e) =>
				{
					var $el = $(e.target);
					if ($el.closest(".modal").length)
					{
						return;
					}
					this.close();
				});

			this.$modalContainer
				.find(".close-button").on(`click.modal-${this.id}`, () => this.close());

			$(document).on(`keydown.modal-${this.id}`, (e) => this.onKeyDown(e));
		}

		private buildModal()
		{
			const id = `modal-${this.id}`;

			const wrapper = `
<div id="${id}" class="modal-wrapper">
	<div class="modal">
		<div class="close-button"><i class="fa fa-times" aria-hidden="true"></i></div>
		<div class="modal-internal">
			${this.content}
		</div>
	</div>
</div>`;

			this.$modalContainer = $(wrapper);
			this.$modal = this.$modalContainer.find(".modal");
		}

		private populateContent(content: string)
		{
			this.$modal.find(".modal-internal").html(content);
		}

		private determineTransitionDuration()
		{
			const transitionCss = this.$modal.css("transition-duration");
			const transitions = transitionCss.match(/[0-9\.]+/g);
			if (!transitions)
			{
				return;
			}
			var maxTransition = 0;
			transitions.map(transition =>
			{
				var transitionFloat = parseFloat(transition);
				maxTransition = transitionFloat > maxTransition
					? transitionFloat
					: maxTransition;
			});
			this.transitionDuration = maxTransition * 1000;
		}

		private toggleHtmlClass(modalOpen: boolean)
		{
			if (modalOpen)
			{
				$("html").addClass(this.modalOpenHtmlClass);
			}
			else
			{
				setTimeout(() =>
					{
						$("html").removeClass(this.modalOpenHtmlClass);
					},
					this.transitionDuration / 2);
			}
		}

		private stopBodyFromScrolling()
		{
			if ($("#modal-open-scrollbar-offset").length)
			{
				return;
			}

			Utility.preventBodyScrolling();
		}

		private onKeyDown(e: JQueryEventObject)
		{
			if (e.which === 27)
			{
				this.close();
			}
		}
	}
}