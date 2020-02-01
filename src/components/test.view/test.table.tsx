import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {makeStyles, Theme} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MaterialTable from 'material-table';
import {useState} from "react";

const useStyles = makeStyles((theme: Theme): any => ({
    '@global': {
        ul: {
            margin: 0,
            padding: 0,
            listStyle: 'none',
        },
    },
    appBar: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    toolbar: {
        flexWrap: 'wrap',
    },
    toolbarTitle: {
        flexGrow: 1,
    },
    heroContent: {
        padding: theme.spacing(2, 0, 1),
    },
}));

const initialColumnData = [
    { title: 'Turn Server Address', field: 'serverAddress', type: 'string'},
    { title: 'Turn User Name', field: 'turnUserName', type: 'string'},
    { title: 'Turn User Password', field: 'turnUserPassword', type: 'string' },
]

const initialData= [
    { serverAddress: 'turn:someAddress:4738', turnUserName: 'MyAwesomeUserName', turnUserPassword: 'myAwesomeTurnPassword'},];

const TestView = ()=> {
    const classes = useStyles();
    const [columns, setColumns] = useState(initialColumnData);
    const [data, setData] = useState(initialData);

    return (
        <React.Fragment>
            <CssBaseline />
            <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
                        Turn Tester
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container maxWidth="xl" component="main" className={classes.heroContent}>
                <MaterialTable
                    title={'Test turn server setup'}
                    columns={columns}
                    data={data}
                />
            </Container>
        </React.Fragment>
    );
}

export default TestView;