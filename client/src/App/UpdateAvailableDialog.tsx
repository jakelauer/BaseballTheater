import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { FiDownloadCloud, IoMdBaseball } from 'react-icons/all';

import { ServiceWorkerUpdate } from '../Global/ServiceWorkerUpdate';

type Changelists = { [datetime: string]: string[] };

export const UpdateAvailableDialog: React.FC = () =>
{
	const [waitingForUpdate, setWaitingForUpdate] = useState(false);
	const [changelistData, setChangelistData] = useState<Changelists | null>(null);

	const checkForUpdates = () =>
	{
		ServiceWorkerUpdate.checkForUpdates((hasUpdate) =>
		{
			setWaitingForUpdate(hasUpdate);
		});
	};

	useEffect(() =>
	{
		checkForUpdates();
		setTimeout(checkForUpdates, 5000);

		fetch("/api/changelist")
			.then(data => data.json())
			.then(changelistData =>
			{
				setChangelistData(changelistData);
			});

	}, []);

	return (
		<Dialog open={waitingForUpdate}>
			<DialogTitle>Update Available</DialogTitle>
			<DialogContent dividers>
				{changelistData && (
					<List>
						{Object.keys(changelistData).map(dateTime => (
							<>
								<Typography variant={"h6"}>{dateTime}</Typography>
								<List style={{padding: 0}}>
									{changelistData[dateTime].map(item => (
										<ListItem style={{padding: "0.5rem 0"}}>
											<ListItemIcon style={{
												minWidth: "31px",
												height: "100%",
												justifySelf: "flex-start",
												alignSelf: "flex-start",
												paddingTop: "0.4rem",
											}}>
												<IoMdBaseball/>
											</ListItemIcon>
											<ListItemText
												style={{
													whiteSpace: "break-spaces"
												}}
												primary={<div dangerouslySetInnerHTML={{__html: item}}/>}/>
										</ListItem>
									))}
								</List>
							</>
						))}
					</List>
				)}
			</DialogContent>
			<DialogActions style={{justifyContent: "center", padding: "1rem"}}>
				<Button color={"primary"} onClick={ServiceWorkerUpdate.update} startIcon={<FiDownloadCloud/>} variant={"contained"}>
					Update Now
				</Button>
			</DialogActions>
		</Dialog>
	);
};