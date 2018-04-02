import * as React from "react";
import {RouteComponentProps} from "react-router";
import {withRouter} from 'react-router-dom';
import {Search} from "../Search/search";

interface ISearchBoxState
{
	currentValue: string;
}

interface ISearchBoxProps
{
	query: string;
	onPerformSearch: (newQuery: string) => void;
}

export class SearchBox extends React.Component<ISearchBoxProps, ISearchBoxState>
{
	private timer: number = 0;

	constructor(props: ISearchBoxProps)
	{
		super(props);

		this.state = {
			currentValue: this.props.query
		}
	}

	public componentWillReceiveProps?(nextProps: Readonly<ISearchBoxProps>, nextContext: any)
	{
		this.setState({
			currentValue: nextProps.query
		})
	}

	private onChange(e: React.ChangeEvent<HTMLInputElement>)
	{
		clearTimeout(this.timer);

		const value = (e.target as HTMLInputElement).value;
		this.setState({
			currentValue: value
		});
		this.timer = window.setTimeout(() => this.performSearch(value), 500);
	}


	private performSearch(query: string)
	{
		//LinkHandler.pushState(`/Search/${encodeURI(query)}`);
		this.props.onPerformSearch(query);
	}

	public render()
	{
		return (
			<div className={`search`}>
				<input type="text" required onChange={e => this.onChange(e)} value={this.state.currentValue}/>
				<div className={`label`}>
					<i className={`material-icons`}>search</i> <span>Search highlights</span>
				</div>
			</div>
		);
	}
}