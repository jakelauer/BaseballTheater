import * as React from "react";

export interface IModalProps
{
	id: string;
	isOpen: boolean;
	onClose: () => void;
}

export class Modal extends React.Component<IModalProps, any>
{
	constructor(props: IModalProps)
	{
		super(props);
	}

	private close()
	{
		this.props.onClose();
	}

	private onWrapperClick(event: React.MouseEvent<HTMLDivElement>)
	{
		if (event.target === event.currentTarget)
		{
			this.close();
		}
	}

	public componentDidUpdate()
	{
		if (this.props.isOpen)
		{
			document.addEventListener("keydown", this.handleKeypress.bind(this));
		}
		else
		{
			this.unbindEsc();
		}
	}

	public componentWillUnmount()
	{
		this.unbindEsc();
	}

	private unbindEsc()
	{
		document.removeEventListener("keydown", this.handleKeypress.bind(this));
	}

	private handleKeypress(event: React.KeyboardEvent<any>)
	{
		if (event.which === 27)
		{
			this.close();
		}
	}

	public render()
	{
		const modalId = `modal-${this.props.id}`;

		const openClass = this.props.isOpen ? "open" : "";

		return (
			<div id={modalId} className={`modal-wrapper ${openClass}`} onClick={e => this.onWrapperClick(e)}>
				<div className="modal">
					<div className="close-button" onClick={() => this.close()}>
						<i className="material-icons">close</i>
					</div>
					<div className="modal-internal">
						{this.props.children}
					</div>
				</div>
			</div>
		);
	}
}
