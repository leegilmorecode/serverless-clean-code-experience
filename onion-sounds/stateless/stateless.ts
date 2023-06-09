import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as events from 'aws-cdk-lib/aws-events';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodeLambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';

import { Construct } from 'constructs';
import { Tracing } from 'aws-cdk-lib/aws-lambda';

export interface ConsumerProps extends cdk.StackProps {
  accountsTable: dynamodb.Table;
  accountsEventBus: events.EventBus;
}

export class OnionSoundsStatelessStack extends cdk.Stack {
  private readonly accountsTable: dynamodb.Table;
  private readonly accountsEventBus: events.EventBus;

  constructor(scope: Construct, id: string, props: ConsumerProps) {
    super(scope, id, props);

    this.accountsTable = props.accountsTable;
    this.accountsEventBus = props.accountsEventBus;

    const lambdaPowerToolsConfig = {
      LOG_LEVEL: 'DEBUG',
      POWERTOOLS_LOGGER_LOG_EVENT: 'true',
      POWERTOOLS_LOGGER_SAMPLE_RATE: '1',
      POWERTOOLS_TRACE_ENABLED: 'enabled',
      POWERTOOLS_TRACER_CAPTURE_HTTPS_REQUESTS: 'captureHTTPsRequests',
      POWERTOOLS_SERVICE_NAME: 'CustomerService',
      POWERTOOLS_TRACER_CAPTURE_RESPONSE: 'captureResult',
      POWERTOOLS_METRICS_NAMESPACE: 'OnionSounds',
    };

    const createAccountLambda: nodeLambda.NodejsFunction =
      new nodeLambda.NodejsFunction(this, 'CreateAccountLambda', {
        runtime: lambda.Runtime.NODEJS_16_X,
        entry: path.join(
          __dirname,
          'src/adapters/primary/create-customer-account/create-customer-account.adapter.ts'
        ),
        memorySize: 1024,
        handler: 'handler',
        tracing: Tracing.ACTIVE,
        bundling: {
          minify: true,
          externalModules: ['aws-sdk'],
        },
        environment: {
          TABLE_NAME: this.accountsTable.tableName,
          EVENT_BUS: this.accountsEventBus.eventBusArn,
          ...lambdaPowerToolsConfig,
        },
      });

    const retrieveAccountLambda: nodeLambda.NodejsFunction =
      new nodeLambda.NodejsFunction(this, 'RetrieveAccountLambda', {
        runtime: lambda.Runtime.NODEJS_16_X,
        entry: path.join(
          __dirname,
          'src/adapters/primary/retrieve-customer-account/retrieve-customer-account.adapter.ts'
        ),
        memorySize: 1024,
        tracing: Tracing.ACTIVE,
        handler: 'handler',
        bundling: {
          minify: true,
          externalModules: ['aws-sdk'],
        },
        environment: {
          TABLE_NAME: this.accountsTable.tableName,
          EVENT_BUS: this.accountsEventBus.eventBusArn,
          ...lambdaPowerToolsConfig,
        },
      });

    const upgradeAccountLambda: nodeLambda.NodejsFunction =
      new nodeLambda.NodejsFunction(this, 'UpgradeAccountLambda', {
        runtime: lambda.Runtime.NODEJS_16_X,
        entry: path.join(
          __dirname,
          'src/adapters/primary/upgrade-customer-account/upgrade-customer-account.adapter.ts'
        ),
        memorySize: 1024,
        tracing: Tracing.ACTIVE,
        handler: 'handler',
        bundling: {
          minify: true,
          externalModules: ['aws-sdk'],
        },
        environment: {
          TABLE_NAME: this.accountsTable.tableName,
          EVENT_BUS: this.accountsEventBus.eventBusArn,
          ...lambdaPowerToolsConfig,
        },
      });

    const createPlaylistLambda: nodeLambda.NodejsFunction =
      new nodeLambda.NodejsFunction(this, 'CreatePlaylistLambda', {
        runtime: lambda.Runtime.NODEJS_16_X,
        entry: path.join(
          __dirname,
          'src/adapters/primary/create-customer-playlist/create-customer-playlist.adpater.ts'
        ),
        memorySize: 1024,
        handler: 'handler',
        tracing: Tracing.ACTIVE,
        bundling: {
          minify: true,
          externalModules: ['aws-sdk'],
        },
        environment: {
          TABLE_NAME: this.accountsTable.tableName,
          EVENT_BUS: this.accountsEventBus.eventBusArn,
          ...lambdaPowerToolsConfig,
        },
      });

    const addSongToPlaylistLambda: nodeLambda.NodejsFunction =
      new nodeLambda.NodejsFunction(this, 'AddSongToPlaylistLambda', {
        runtime: lambda.Runtime.NODEJS_16_X,
        entry: path.join(
          __dirname,
          'src/adapters/primary/add-song-to-playlist/add-song-to-playlist.adapter.ts'
        ),
        memorySize: 1024,
        handler: 'handler',
        tracing: Tracing.ACTIVE,
        bundling: {
          minify: true,
          externalModules: ['aws-sdk'],
        },
        environment: {
          TABLE_NAME: this.accountsTable.tableName,
          EVENT_BUS: this.accountsEventBus.eventBusArn,
          ...lambdaPowerToolsConfig,
        },
      });

    this.accountsTable.grantWriteData(createAccountLambda);
    this.accountsTable.grantReadData(retrieveAccountLambda);
    this.accountsTable.grantReadWriteData(upgradeAccountLambda);
    this.accountsTable.grantReadWriteData(createPlaylistLambda);
    this.accountsTable.grantReadWriteData(addSongToPlaylistLambda);

    this.accountsEventBus.grantPutEventsTo(createAccountLambda);
    this.accountsEventBus.grantPutEventsTo(upgradeAccountLambda);
    this.accountsEventBus.grantPutEventsTo(createPlaylistLambda);
    this.accountsEventBus.grantPutEventsTo(addSongToPlaylistLambda);

    const accountsApi: apigw.RestApi = new apigw.RestApi(this, 'AccountsApi', {
      description: 'Onion Accounts API',
      deploy: true,
      deployOptions: {
        stageName: 'prod',
        loggingLevel: apigw.MethodLoggingLevel.INFO,
      },
    });

    const accounts: apigw.Resource = accountsApi.root.addResource('accounts');
    const account: apigw.Resource = accounts.addResource('{id}');
    const playlists: apigw.Resource = account.addResource('playlists');
    const playlist: apigw.Resource = playlists.addResource('{playlistId}');

    playlist.addMethod(
      'POST',
      new apigw.LambdaIntegration(addSongToPlaylistLambda, {
        proxy: true,
      })
    );

    accounts.addMethod(
      'POST',
      new apigw.LambdaIntegration(createAccountLambda, {
        proxy: true,
      })
    );

    playlists.addMethod(
      'POST',
      new apigw.LambdaIntegration(createPlaylistLambda, {
        proxy: true,
      })
    );

    account.addMethod(
      'GET',
      new apigw.LambdaIntegration(retrieveAccountLambda, {
        proxy: true,
      })
    );

    account.addMethod(
      'PATCH',
      new apigw.LambdaIntegration(upgradeAccountLambda, {
        proxy: true,
      })
    );
  }
}
