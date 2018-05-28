<?php
namespace Application;

use Application\Controller as ApplicationController;
use LeoGalleguillos\User\Model\Factory as UserFactory;
use LeoGalleguillos\User\Model\Table as UserTable;
use Zend\Router\Http\Literal;
use Zend\Router\Http\Segment;
use Zend\ServiceManager\Factory\InvokableFactory;

return [
    'router' => [
        'routes' => [
            'home' => [
                'type' => Literal::class,
                'options' => [
                    'route'    => '/',
                    'defaults' => [
                        'controller' => Controller\Index::class,
                        'action'     => 'index',
                    ],
                ],
            ],
            'user' => [
                'type' => Segment::class,
                'options' => [
                    'route'    => '/user/:action',
                    'defaults' => [
                        'controller' => Controller\User::class,
                    ],
                ],
            ],
        ],
    ],
    'controllers' => [
        'factories' => [
            ApplicationController\Index::class => function ($serviceManager) {
                return new ApplicationController\Index(
                    $serviceManager->get(UserFactory\User\BuildFromCookies::class)
                );
            },
            ApplicationController\User::class => function ($serviceManager) {
                return new ApplicationController\User(
                    $serviceManager->get(UserFactory\User\BuildFromCookies::class),
                    $serviceManager->get(UserTable\User\DisplayName::class)
                );
            },
        ],
    ],
    'view_manager' => [
        'display_not_found_reason' => true,
        'display_exceptions'       => true,
        'doctype'                  => 'HTML5',
        'not_found_template'       => 'error/404',
        'exception_template'       => 'error/index',
        'template_map' => [
            'layout/layout'           => __DIR__ . '/../view/layout/layout.phtml',
            'application/index/index' => __DIR__ . '/../view/application/index/index.phtml',
            'error/404'               => __DIR__ . '/../view/error/404.phtml',
            'error/index'             => __DIR__ . '/../view/error/index.phtml',
        ],
        'template_path_stack' => [
            __DIR__ . '/../view',
        ],
    ],
];
